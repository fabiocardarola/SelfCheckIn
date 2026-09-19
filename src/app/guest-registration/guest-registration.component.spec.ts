import { BookingService } from '../booking.service';
import { TEST_BOOKING } from '../testing/booking.fixture';
import { TestBed } from '@angular/core/testing';
import { GuestRegistrationComponent } from './guest-registration.component';

describe('GuestRegistrationComponent', () => {
  beforeEach(async () => {
    window.scrollTo = () => undefined;
    window.sessionStorage.clear();
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.includes('stati.csv')) return new Response('Codice,Descrizione,Provincia,DataFineVal\n100000100,ITALIA,ES,\n100000215,FRANCIA,ES,\n');
      if (url.includes('comuni.csv')) return new Response('Codice,Descrizione,Provincia,DataFineVal\n405058091,ROMA,RM,\n');
      return new Response("Codice,Descrizione\nPASOR,PASSAPORTO ORDINARIO\n");
    };
    await TestBed.configureTestingModule({ imports: [GuestRegistrationComponent], providers: [{ provide: BookingService, useValue: { request: vi.fn(async (method: string) => method === 'sci_guests' ? { guests: [] } : { pk: 123 }) } }] }).compileComponents();
  });

  it('registers the booking holder and prefills nationality for the next guest', async () => {
    const fixture = TestBed.createComponent(GuestRegistrationComponent);
    fixture.componentRef.setInput('booking', TEST_BOOKING);
    fixture.componentRef.setInput('language', 'it');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (selector: string, index = 0) => {
      element.querySelectorAll<HTMLButtonElement>(selector)[index].click();
      await fixture.whenStable();
    };
    const type = async (input: HTMLInputElement, value: string) => {
      input.value = value; input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
    };

    await click('.start-button');
    let inputs = element.querySelectorAll<HTMLInputElement>('.guest-form > label > input');
    await type(inputs[0], 'Cárdarola-2');
    await type(inputs[1], 'Fábio');
    expect(inputs[0].value).toBe('CARDAROLA');
    expect(inputs[1].value).toBe('FABIO');
    await click('.choice-row button', 0);

    await click('.picker-field', 0);
    await type(element.querySelector('.number-entry') as HTMLInputElement, '15');
    await click('.modal-primary');
    await click('.month-grid button', 0);
    await click('.modal-primary');
    await type(element.querySelector('.number-entry') as HTMLInputElement, '1990');
    await click('.modal-primary');

    await click('.picker-field', 1);
    await click('.results-list button', 0);
    await click('.picker-field', 2);
    await click('.results-list button', 0);
    await click('.picker-field', 3);
    await click('.document-grid button', 0);
    await click('.modal-actions .reg-primary');

    inputs = element.querySelectorAll<HTMLInputElement>('.guest-form > label > input');
    await type(inputs[2], 'ab-12ç3');
    expect(inputs[2].value).toBe('AB12C3');
    expect(element.querySelector('.nav-next')?.classList.contains('is-ready')).toBe(true);

    await click('.nav-next');
    expect(element.querySelector('.guest-progress')?.textContent).toContain('1/4');
    expect(element.querySelectorAll('.picker-field')[1].textContent).toContain('ITALIA');
  });

  it('restores partially entered guest data when registration is reopened', async () => {
    const firstFixture = TestBed.createComponent(GuestRegistrationComponent);
    firstFixture.componentRef.setInput('booking', TEST_BOOKING);
    firstFixture.componentRef.setInput('language', 'it');
    await firstFixture.whenStable();

    (firstFixture.nativeElement.querySelector('.start-button') as HTMLButtonElement).click();
    await firstFixture.whenStable();
    const surname = firstFixture.nativeElement.querySelector('.guest-form > label > input') as HTMLInputElement;
    surname.value = 'Rossi';
    surname.dispatchEvent(new Event('input', { bubbles: true }));
    await firstFixture.whenStable();
    firstFixture.destroy();

    const reopenedFixture = TestBed.createComponent(GuestRegistrationComponent);
    reopenedFixture.componentRef.setInput('booking', TEST_BOOKING);
    reopenedFixture.componentRef.setInput('language', 'it');
    await reopenedFixture.whenStable();
    (reopenedFixture.nativeElement.querySelector('.start-button') as HTMLButtonElement).click();
    await reopenedFixture.whenStable();

    const restoredSurname = reopenedFixture.nativeElement.querySelector('.guest-form > label > input') as HTMLInputElement;
    expect(restoredSurname.value).toBe('ROSSI');
  });
  it('uses the real booking and isolates drafts by reservation', async () => {
    window.sessionStorage.setItem('helloHost.guestRegistration.v2.123.TESTPNR', JSON.stringify({ guestIndex: 0, guests: [{ surname: 'PRIVATE' }] }));
    const fixture = TestBed.createComponent(GuestRegistrationComponent);
    fixture.componentRef.setInput('booking', { ...TEST_BOOKING, fkbooking: 456, pnr: 'OTHER', customer: 'Jane Smith', people: 2, host_arrival: '2027-03-01', host_departure: '2027-03-03' });
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.reservation-name')?.textContent).toContain('Jane Smith');
    expect(element.querySelector('.reservation-facts')?.textContent).toContain('2027');
    expect(element.querySelector('.law-card')?.textContent).toContain('2');
    element.querySelector<HTMLButtonElement>('.start-button')!.click();
    await fixture.whenStable();
    expect(element.querySelector<HTMLInputElement>('.guest-form > label > input')!.value).toBe('');
    expect(element.querySelector('.guest-progress')?.textContent).toContain('0/2');
  });

  it('reopens the first passport despite a later saved position and updates the existing record', async () => {
    window.sessionStorage.setItem('helloHost.guestRegistration.v2.123.TESTPNR', JSON.stringify({ guestIndex: 2, guests: [] }));
    const api = vi.mocked(TestBed.inject(BookingService).request);
    const saved = { pk: 81, surname: 'ROSSI', name: 'MARIO', gender: 'M', birthDate: '1990-01-15', nationalityCode: '100000100', birthPlaceCode: '405058091', documentTypeCode: 'PASOR', documentNumber: 'AB123', issuingCountryCode: '100000215' };
    api.mockResolvedValueOnce({ guests: [saved] }).mockResolvedValueOnce({ pk: 81 });
    const fixture = TestBed.createComponent(GuestRegistrationComponent);
    fixture.componentRef.setInput('booking', TEST_BOOKING);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.start-button')!.click();
    await fixture.whenStable();
    const name = element.querySelectorAll<HTMLInputElement>('.guest-form > label > input')[1];
    expect(name.value).toBe('MARIO');
    expect(element.textContent).toContain('ROMA');
    name.value = 'LUIGI'; name.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('.nav-next')!.click();
    await fixture.whenStable();
    expect(api).toHaveBeenLastCalledWith('sci_guest_save', { index: 0, guest: expect.objectContaining({ pk: 81, name: 'LUIGI', issuingCountryCode: '100000215' }) });
  });

  it('blocks registration on load failure and retries without treating it as an empty booking', async () => {
    const api = vi.mocked(TestBed.inject(BookingService).request);
    api.mockRejectedValueOnce(new Error('Network')).mockResolvedValueOnce({ guests: [] });
    const fixture = TestBed.createComponent(GuestRegistrationComponent);
    fixture.componentRef.setInput('booking', TEST_BOOKING);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector<HTMLButtonElement>('.start-button')!.disabled).toBe(true);
    expect(element.querySelector('[role="alert"]')).toBeTruthy();
    element.querySelector<HTMLButtonElement>('.registration-screen > .reg-primary')!.click();
    await fixture.whenStable();
    expect(element.querySelector<HTMLButtonElement>('.start-button')!.disabled).toBe(false);
  });

  it('keeps the guest on screen after save failure and prevents duplicate in-flight saves', async () => {
    const api = vi.mocked(TestBed.inject(BookingService).request);
    api.mockResolvedValueOnce({ guests: [{ pk: 81, surname: 'ROSSI', name: 'MARIO', gender: 'M', birthDate: '1990-01-15', nationalityCode: '100000215', documentTypeCode: 'PASOR', documentNumber: 'AB123' }] });
    const fixture = TestBed.createComponent(GuestRegistrationComponent);
    fixture.componentRef.setInput('booking', TEST_BOOKING);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.start-button')!.click();
    await fixture.whenStable();
    let reject!: (error: Error) => void;
    api.mockImplementationOnce(() => new Promise((_, fail) => { reject = fail; }));
    const next = element.querySelector<HTMLButtonElement>('.nav-next')!;
    next.click(); next.click(); fixture.detectChanges();
    expect(next.disabled).toBe(true);
    expect(api.mock.calls.filter(([method]) => method === 'sci_guest_save')).toHaveLength(1);
    reject(new Error('Database failure'));
    await vi.waitFor(() => { fixture.detectChanges(); expect(element.querySelector('[role="alert"]')).toBeTruthy(); });
    expect(next.disabled).toBe(false);
    expect(element.querySelector<HTMLInputElement>('.guest-form > label > input')!.value).toBe('ROSSI');
    expect(element.querySelector('.guest-badge')!.textContent).toBe('1');
  });

});
