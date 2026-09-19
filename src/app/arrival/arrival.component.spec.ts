import { TestBed } from '@angular/core/testing';
import { ArrivalComponent } from './arrival.component';
import { DEMO_ARRIVAL, directionsUrl, FREENOW_APP_URL, FREENOW_WEB_URL, nccQuote, uberUrl } from './arrival-config';
import { TEST_BOOKING } from '../testing/booking.fixture';
import { ARRIVAL_COPY } from './arrival-copy';

describe('Arrival', () => {
  it('uses FCO for transfers and the current location for walking', () => {
    const uber = new URL(uberUrl(DEMO_ARRIVAL));
    expect(uber.protocol).toBe('https:');
    expect(uber.pathname).toBe('/ul/');
    const current = new URL(uberUrl(DEMO_ARRIVAL, false));
    expect([...current.searchParams.keys()].some((key) => key.startsWith('pickup'))).toBe(false);
    expect(current.searchParams.get('dropoff[nickname]')).toBe(DEMO_ARRIVAL.destination.address);
    expect(uber.searchParams.get('pickup[latitude]')).toBe(String(DEMO_ARRIVAL.origin.latitude));
    expect(uber.searchParams.get('pickup[longitude]')).toBe(String(DEMO_ARRIVAL.origin.longitude));
    expect(uber.searchParams.get('dropoff[latitude]')).toBe(String(DEMO_ARRIVAL.destination.latitude));
    expect(uber.searchParams.get('dropoff[longitude]')).toBe(String(DEMO_ARRIVAL.destination.longitude));
    expect(uber.searchParams.get('dropoff[formatted_address]')).toBe(DEMO_ARRIVAL.destination.address);
    for (const mode of ['walking', 'transit'] as const) {
      const url = new URL(directionsUrl(DEMO_ARRIVAL, mode));
      expect(url.searchParams.get('origin')).toBe(mode === 'walking' ? null : '41.7999,12.2462');
      expect(url.searchParams.get('destination')).toBe('41.9004,12.4682');
      expect(url.searchParams.get('travelmode')).toBe(mode);
      expect(url.searchParams.get('api')).toBe('1');
    }
  });

  it('selects the requested NCC tariff by booking size and handles unsupported groups', () => {
    for (const [guests, price] of [[1, 80], [2, 80], [3, 90], [4, 90], [5, 100], [6, 100]]) {
      expect(nccQuote(DEMO_ARRIVAL, guests)).toBe(price);
    }
    for (const guests of [7, 8, 0, -1, 1.5, NaN]) {
      expect(nccQuote(DEMO_ARRIVAL, guests)).toBeNull();
    }
  });

  it('renders the address first, six options and the NCC quote including luggage', async () => {
    const fixture = TestBed.createComponent(ArrivalComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('section')?.firstElementChild?.textContent).toContain(DEMO_ARRIVAL.destination.address);
    expect(el.querySelectorAll('.transport-card')).toHaveLength(6);
    expect(el.querySelector('[data-mode="taxi"] a')?.getAttribute('href')).toBe('tel:+39063570');
    expect(el.querySelector('[data-mode="ncc"]')?.textContent).toContain('90');
    expect(el.querySelector('[data-mode="ncc"]')?.textContent).toContain('4 persone');
    expect(el.querySelector('[data-mode="ncc"]')?.textContent).toContain('Bagagli inclusi');
    expect(el.querySelector('[data-mode="freenow"]')?.textContent).toContain('inseriscilo come destinazione');
    const uberLinks = el.querySelectorAll<HTMLAnchorElement>('[data-mode="uber"] a');
    expect(uberLinks).toHaveLength(2);
    expect(uberLinks[0].href).toBe(uberUrl(DEMO_ARRIVAL));
    expect(uberLinks[1].href).toBe(uberUrl(DEMO_ARRIVAL, false));
    const freeNowLinks = el.querySelectorAll<HTMLAnchorElement>('[data-mode="freenow"] a');
    expect(freeNowLinks).toHaveLength(2);
    expect(freeNowLinks[0].href).toBe(FREENOW_APP_URL);
    expect(new URL(freeNowLinks[0].href).protocol).toBe('https:');
    expect(freeNowLinks[1].href).toBe(FREENOW_WEB_URL);
    const walking = new URL(el.querySelector<HTMLAnchorElement>('[data-mode="walking"] a')!.href);
    expect(walking.searchParams.has('origin')).toBe(false);
    expect(walking.searchParams.get('destination')).toBe('41.9004,12.4682');
    expect(el.querySelector('[data-mode="walking"]')?.textContent).toContain('posizione attuale');
  });

  it('removes outbound links and disables actions for apartment-specific unavailable options', async () => {
    const fixture = TestBed.createComponent(ArrivalComponent);
    fixture.componentRef.setInput('config', { ...DEMO_ARRIVAL, enabled: { taxi: false, ncc: false, uber: false, freenow: false, transit: false, walking: false } });
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.transport-card a')).toHaveLength(0);
    expect(el.querySelectorAll('.transport-card button:disabled')).toHaveLength(6);
  });

  it('localizes the screen in all ten supported languages', async () => {
    const fixture = TestBed.createComponent(ArrivalComponent);
    for (const language of Object.keys(ARRIVAL_COPY) as (keyof typeof ARRIVAL_COPY)[]) {
      fixture.componentRef.setInput('language', language);
      await fixture.whenStable();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('h2')?.textContent).toBe(ARRIVAL_COPY[language].title);
      expect(el.textContent).not.toMatch(/\{count\}|\{price\}|undefined/);
      expect(el.querySelectorAll('.transport-card')).toHaveLength(6);
    }
  });

  it('opens and closes the NCC modal and prefills WhatsApp with the actual booking', async () => {
    const fixture = TestBed.createComponent(ArrivalComponent);
    fixture.componentRef.setInput('booking', { ...TEST_BOOKING, customer: 'Zoë & Mario', pnr: 'PNR+123' });
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const dialog = el.querySelector('dialog')!;
    // jsdom does not implement the browser's native dialog methods.
    dialog.showModal = () => dialog.setAttribute('open', '');
    dialog.close = () => dialog.removeAttribute('open');
    expect(dialog.open).toBe(false);
    el.querySelector<HTMLButtonElement>('[data-mode="ncc"] button')!.click();
    expect(dialog.open).toBe(true);
    expect(dialog.textContent).toContain('Contatta l’host');
    const url = new URL(dialog.querySelector<HTMLAnchorElement>('a')!.href);
    expect(url.origin + url.pathname).toBe('https://wa.me/393461098903');
    expect(url.searchParams.get('text')).toBe('Sono Zoë & Mario, prenotazione numero PNR+123 con arrivo il 16 settembre 2026. Vorrei maggiori informazioni sul trasferimento con auto privata NCC.');
    expect(el.querySelector('[data-mode="ncc"]')!.textContent).toContain('270');
    dialog.querySelector('button')!.click();
    expect(dialog.open).toBe(false);
  });

  it('offers host contact without inventing an FCO price for more than six guests', async () => {
    const fixture = TestBed.createComponent(ArrivalComponent);
    fixture.componentRef.setInput('guestCount', 7);
    await fixture.whenStable();
    const card = fixture.nativeElement.querySelector('[data-mode="ncc"]') as HTMLElement;
    expect(card.querySelector('.price')).toBeNull();
    expect(card.textContent).toContain('Preventivo su richiesta');
    expect(card.querySelector('button')?.disabled).toBe(false);
  });

  it('localizes the WhatsApp message and handles a missing arrival date', async () => {
    const fixture = TestBed.createComponent(ArrivalComponent);
    fixture.componentRef.setInput('booking', { ...TEST_BOOKING, host_arrival: null });
    for (const language of Object.keys(ARRIVAL_COPY) as (keyof typeof ARRIVAL_COPY)[]) {
      fixture.componentRef.setInput('language', language);
      await fixture.whenStable();
      const el = fixture.nativeElement as HTMLElement;
      const message = new URL(el.querySelector<HTMLAnchorElement>('dialog a')!.href).searchParams.get('text')!;
      expect(message).toContain(TEST_BOOKING.customer);
      expect(message).toContain(TEST_BOOKING.pnr);
      expect(message).toContain(ARRIVAL_COPY[language].unknownDate);
      expect(message).not.toMatch(/\{name\}|\{pnr\}|\{date\}|undefined/);
      expect(el.querySelector('dialog p')!.textContent).toBe(ARRIVAL_COPY[language].nccContact);
    }
  });

  it('copies the destination and provides a fallback if clipboard access fails', async () => {
    const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    try {
      let value = '';
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { value = text; } } });
      const fixture = TestBed.createComponent(ArrivalComponent);
      await fixture.whenStable();
      const el = fixture.nativeElement as HTMLElement;
      (el.querySelector('.address-copy') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(value).toBe(DEMO_ARRIVAL.destination.address);
      expect(el.querySelector('[role="status"]')?.textContent).toContain('Indirizzo copiato');
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
      (el.querySelector('.address-copy') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(el.querySelector('[role="status"]')?.textContent).toContain('Seleziona e copia');
    } finally {
      if (original) Object.defineProperty(navigator, 'clipboard', original);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });
});
