import { Component, computed, input, output, signal } from '@angular/core';
import { RegistrationLanguage, REGISTRATION_LOCALES } from '../guest-registration/registration-copy';
import { Booking } from '../booking.service';
import { ARRIVAL_COPY } from './arrival-copy';
import { ArrivalConfig, DEMO_ARRIVAL, DEMO_GUEST_COUNT, directionsUrl, FREENOW_APP_URL, FREENOW_WEB_URL, nccQuote, NCC_PORT_PRICE, NCC_WHATSAPP_PHONE, TransportMode, uberUrl } from './arrival-config';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrl: './arrival.component.scss'
})
export class ArrivalComponent {
  protected readonly freeNowWebsite = FREENOW_WEB_URL;
  protected readonly uberCurrentUrl = computed(() => uberUrl(this.config(), false));
  readonly language = input<RegistrationLanguage>('it');
  readonly config = input<ArrivalConfig>(DEMO_ARRIVAL);
  readonly guestCount = input(DEMO_GUEST_COUNT);
  readonly booking = input<Booking | null>(null);
  readonly completed = output<void>();
  readonly cancelled = output<void>();
  protected readonly copy = computed(() => ARRIVAL_COPY[this.language()]);
  protected readonly copyState = signal<'idle' | 'copied' | 'failed'>('idle');
  protected readonly guestLabel = computed(() => this.copy().guests.replace('{count}', String(this.guestCount())));
  protected readonly quote = computed(() => nccQuote(this.config(), this.guestCount()));
  protected readonly options = computed(() => {
    const c = this.copy();
    const config = this.config();
    const rows: { id: TransportMode; icon: string; title: string; detail: string; price?: string; href?: string; action?: string }[] = [
      { id: 'ncc', icon: '🚘', title: c.ncc, price: this.startingPrice(), detail: c.luggage },
      { id: 'taxi', icon: '🚕', title: c.taxi, price: this.money(config.taxi.flatRate), detail: c.taxiDetail, href: `tel:${config.taxi.phone.replace(/\s/g, '')}`, action: `${c.call} · ${config.taxi.phone}` },
      { id: 'uber', icon: '🚗', title: 'Uber', detail: c.uberDetail, href: uberUrl(config), action: c.uberOpen },
      { id: 'freenow', icon: '🚖', title: 'FreeNow', detail: c.freeNowDetail, href: FREENOW_APP_URL, action: c.freeNowOpen },
      { id: 'transit', icon: '🚇', title: c.transit, detail: c.transitDetail, href: directionsUrl(config, 'transit'), action: c.navigate },
      { id: 'walking', icon: '🚶', title: c.walking, detail: c.walkingDetail, href: directionsUrl(config, 'walking'), action: c.navigate }
    ];
    return rows.map((row) => ({ ...row, enabled: config.enabled[row.id] }));
  });

  protected readonly startingPrice = computed(() => {
    const prices = this.config().ncc.map(row => row.price);
    return prices.length ? this.copy().startingPrice.replace('{price}', this.money(Math.min(...prices))) : this.copy().noQuote;
  });
  protected readonly bookingQuote = computed(() => {
    const price = this.quote();
    return price === null ? this.copy().noQuote
      : this.copy().quote.replace('{price}', this.money(price)).replace('{count}', String(this.guestCount()));
  });
  protected readonly priceList = computed(() => [...this.config().ncc]
    .sort((a, b) => a.capacity - b.capacity)
    .map(row => ({ capacity: row.capacity, guests: this.copy().upToGuests.replace('{count}', String(row.capacity)), price: this.money(row.price) })));

  protected readonly portQuote = computed(() => this.copy().port.replace('{price}', this.money(NCC_PORT_PRICE)));
  protected readonly whatsappUrl = computed(() => {
    const booking = this.booking();
    if (!booking) return null;
    // Use the calendar date supplied by the backend, without timezone conversion.
    const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(booking.host_arrival ?? '');
    const date = parts ? new Intl.DateTimeFormat(REGISTRATION_LOCALES[this.language()], {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    }).format(new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])))) : this.copy().unknownDate;
    const values: Record<string, string> = { name: booking.customer, pnr: booking.pnr, date };
    const message = this.copy().nccMessage.replace(/\{(name|pnr|date)\}/g, (_, key: string) => values[key]);
    return `https://wa.me/${NCC_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  });

  private money(value: number): string {
    return new Intl.NumberFormat(REGISTRATION_LOCALES[this.language()], { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  }

  protected async copyAddress(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.config().destination.address);
      this.copyState.set('copied');
    } catch {
      this.copyState.set('failed');
    }
  }
}
