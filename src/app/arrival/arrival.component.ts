import { Component, computed, input, output, signal } from '@angular/core';
import { RegistrationLanguage, REGISTRATION_LOCALES } from '../guest-registration/registration-copy';
import { ARRIVAL_COPY } from './arrival-copy';
import { ArrivalConfig, DEMO_ARRIVAL, DEMO_GUEST_COUNT, directionsUrl, FREENOW_APP_URL, FREENOW_WEB_URL, nccQuote, TransportMode, uberUrl } from './arrival-config';

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
  readonly completed = output<void>();
  readonly cancelled = output<void>();
  protected readonly copy = computed(() => ARRIVAL_COPY[this.language()]);
  protected readonly copyState = signal<'idle' | 'copied' | 'failed'>('idle');
  protected readonly guestLabel = computed(() => this.copy().guests.replace('{count}', String(this.guestCount())));
  protected readonly quote = computed(() => nccQuote(this.config(), this.guestCount()));
  protected readonly options = computed(() => {
    const c = this.copy();
    const config = this.config();
    const quote = this.quote();
    const rows: { id: TransportMode; icon: string; title: string; detail: string; price?: string; href?: string; action?: string }[] = [
      { id: 'taxi', icon: '🚕', title: c.taxi, price: this.money(config.taxi.flatRate), detail: c.taxiDetail, href: `tel:${config.taxi.phone.replace(/\s/g, '')}`, action: `${c.call} · ${config.taxi.phone}` },
      { id: 'ncc', icon: '🚘', title: c.ncc, price: quote === null ? undefined : c.quote.replace('{price}', this.money(quote)).replace('{count}', String(this.guestCount())), detail: quote === null ? c.noQuote : c.simulation },
      { id: 'uber', icon: '🚗', title: 'Uber', detail: c.uberDetail, href: uberUrl(config), action: c.uberOpen },
      { id: 'freenow', icon: '🚖', title: 'FreeNow', detail: c.freeNowDetail, href: FREENOW_APP_URL, action: c.freeNowOpen },
      { id: 'transit', icon: '🚇', title: c.transit, detail: c.transitDetail, href: directionsUrl(config, 'transit'), action: c.navigate },
      { id: 'walking', icon: '🚶', title: c.walking, detail: c.walkingDetail, href: directionsUrl(config, 'walking'), action: c.navigate }
    ];
    return rows.map((row) => ({ ...row, enabled: config.enabled[row.id] }));
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
