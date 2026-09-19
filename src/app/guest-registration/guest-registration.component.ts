import { Booking, BookingService } from '../booking.service';
import { Component, OnInit, PendingTasks, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { REGISTRATION_COPY, REGISTRATION_LOCALES, RegistrationLanguage } from './registration-copy';

import { documentTypeLabel } from './document-type-copy';
import { REGISTRATION_API_COPY } from './registration-api-copy';

type GuestField = 'surname' | 'name' | 'gender' | 'documentNumber';
type ModalType = 'date' | 'nationality' | 'birthPlace' | 'documentType' | 'alert' | null;

interface CodeItem { code: string; description: string; }
interface GuestRecord {
  pk: number; issuingCountryCode: string;
  surname: string; name: string; gender: string;
  birthDate: string; birthDateLabel: string;
  nationalityCode: string; nationality: string;
  birthPlaceCode: string; birthPlace: string;
  documentTypeCode: string; documentType: string;
  documentNumber: string; saved: boolean;
}

const EMPTY_GUEST = (): GuestRecord => ({
  pk: 0, issuingCountryCode: '', surname: '', name: '', gender: '', birthDate: '', birthDateLabel: '', nationalityCode: '', nationality: '',
  birthPlaceCode: '', birthPlace: '', documentTypeCode: '', documentType: '', documentNumber: '', saved: false
});

@Component({
  selector: 'app-guest-registration',
  imports: [FormsModule],
  templateUrl: './guest-registration.component.html',
  styleUrl: './guest-registration.component.scss'
})
export class GuestRegistrationComponent implements OnInit {
  readonly language = input<RegistrationLanguage>('it');
  readonly cancelled = output<void>();
  readonly completed = output<void>();

  readonly booking = input.required<Booking>();
  protected get totalGuests(): number { return this.booking().people; }
  private get storageKey(): string { return `helloHost.guestRegistration.v2.${this.booking().fkbooking}.${this.booking().pnr}`; }
  private readonly api = inject(BookingService);
  protected readonly apiLoading = signal(true);
  protected readonly apiSaving = signal(false);
  protected readonly apiError = signal(false);
  protected readonly apiCopy = computed(() => REGISTRATION_API_COPY[this.language()]);
  private readonly stateReady = signal(false);
  protected readonly initials = computed(() => this.booking().customer.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase());
  protected readonly guestIndex = signal(0);
  protected readonly mode = signal<'intro' | 'form'>('intro');
  protected readonly guests = signal<GuestRecord[]>([EMPTY_GUEST()]);
  protected readonly modal = signal<ModalType>(null);
  protected readonly countries = signal<CodeItem[]>([]);
  protected readonly birthPlaces = signal<CodeItem[]>([]);
  protected readonly documentTypes = signal<CodeItem[]>([]);
  protected readonly listsLoading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly selectedDocumentCode = signal('');
  protected readonly dateStep = signal(1);
  protected readonly dateDay = signal('');
  protected readonly dateMonth = signal<number | null>(null);
  protected readonly dateYear = signal('');
  protected readonly dateError = signal('');
  protected readonly alertTitle = signal('');
  protected readonly alertMessage = signal('');
  protected readonly alertItems = signal<string[]>([]);
  protected readonly alertCompletesRegistration = signal(false);

  protected readonly copy = computed(() => REGISTRATION_COPY[this.language()]);
  protected readonly locale = computed(() => REGISTRATION_LOCALES[this.language()]);
  protected readonly currentGuest = computed(() => this.guests()[this.guestIndex()]);
  protected readonly registeredCount = computed(() => this.guests().filter((guest) => guest.saved).length);
  protected readonly months = computed(() => Array.from({ length: 12 }, (_, month) => ({
    value: month,
    label: new Intl.DateTimeFormat(this.locale(), { month: 'long' }).format(new Date(2026, month, 1))
  })));
  protected readonly stayLabel = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { day: 'numeric', month: 'short', year: 'numeric' });
    const format = (value: string | null) => {
      if (!value) return '—';
      const date = new Date(value.slice(0, 10) + 'T12:00:00');
      return Number.isNaN(date.getTime()) ? '—' : formatter.format(date);
    };
    return `${format(this.booking().host_arrival)} – ${format(this.booking().host_departure)}`;
  });
  protected readonly filteredItems = computed(() => {
    const source = this.modal() === 'nationality' ? this.countries() : this.birthPlaces();
    const query = this.normalizeForSearch(this.searchQuery());
    return source.filter((item) => !query || this.normalizeForSearch(item.description).includes(query)).slice(0, 60);
  });
  private readonly persistState = effect(() => {
    if (!this.stateReady()) return;
    const state = { guestIndex: this.guestIndex(), guests: this.guests() };
    try { window.sessionStorage.setItem(this.storageKey, JSON.stringify(state)); } catch { /* Storage may be unavailable in private mode. */ }
  });

  private readonly pendingTasks = inject(PendingTasks);

  ngOnInit(): void { void this.pendingTasks.run(() => this.initialize()); }

  private async initialize(): Promise<void> {
    const state = this.restoreState();
    this.guests.set(state.guests);
    // Reopening registration always starts with the booking holder.
    this.guestIndex.set(0);

    try {
      const [states, towns, documents] = await Promise.all([
        this.loadCsv('/assets/data/stati.csv'),
        this.loadCsv('/assets/data/comuni.csv'),
        this.loadCsv('/assets/data/documenti.csv')
      ]);
      this.countries.set(states);
      this.birthPlaces.set([
        ...towns.filter((town) => !town.endDate).map(({ code, description }) => ({ code, description })),
        ...states.map(({ code, description }) => ({ code, description: `ES - ${description}` }))
      ]);
      this.documentTypes.set(documents);
    } catch {
      this.countries.set([]);
      this.birthPlaces.set([]);
      this.documentTypes.set([]);
    } finally {
      this.listsLoading.set(false);
    }
    await this.loadGuests();
  }

  protected async loadGuests(): Promise<void> {
    this.apiLoading.set(true);
    this.apiError.set(false);
    try {
      const result = await this.api.request<{ guests: Partial<GuestRecord>[] }>('sci_guests');
      const drafts = this.guests();
      this.guests.set(Array.from({ length: Math.max(this.totalGuests, result.guests.length) }, (_, index) => {
        const saved = result.guests[index];
        const guest = { ...EMPTY_GUEST(), ...(saved ?? drafts[index]), saved: !!saved };
        if (!saved) guest.pk = 0;
        guest.surname = this.asciiLetters(guest.surname);
        guest.name = this.asciiLetters(guest.name);
        guest.documentNumber = this.asciiLettersAndNumbers(guest.documentNumber);
        guest.nationality = this.countries().find(item => item.code === guest.nationalityCode)?.description ?? guest.nationalityCode;
        guest.birthPlace = this.birthPlaces().find(item => item.code === guest.birthPlaceCode)?.description ?? guest.birthPlaceCode;
        guest.documentType = this.documentTypes().find(item => item.code === guest.documentTypeCode)?.description ?? guest.documentTypeCode;
        guest.birthDateLabel = guest.birthDate ? new Intl.DateTimeFormat(this.locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(guest.birthDate + 'T12:00:00')) : '';
        return guest;
      }));
      this.stateReady.set(true);
      this.apiLoading.set(false);
    } catch {
      this.apiError.set(true);
    }
  }

  private async saveCurrent(): Promise<boolean> {
    if (this.apiSaving() || this.apiLoading()) return false;
    this.apiSaving.set(true);
    this.apiError.set(false);
    const index = this.guestIndex();
    const guest = { ...this.currentGuest() };
    try {
      const result = await this.api.request<{ pk: number }>('sci_guest_save', { index, guest });
      this.guests.update(guests => guests.map((item, i) => i === index ? { ...guest, pk: result.pk, saved: true } : item));
      return true;
    } catch {
      this.apiError.set(true);
      return false;
    } finally { this.apiSaving.set(false); }
  }

  protected text(template: string, values: Record<string, string | number>): string {
    return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
  }

  protected start(): void { if (this.apiLoading()) return; this.mode.set('form'); this.scrollTop(); }

  protected updateAlpha(field: 'surname' | 'name', event: Event): void {
    const input = event.target as HTMLInputElement;
    const normalized = this.asciiLetters(input.value);
    input.value = normalized;
    this.updateGuest(field, normalized);
  }

  protected updateDocumentNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const normalized = this.asciiLettersAndNumbers(input.value);
    input.value = normalized;
    this.updateGuest('documentNumber', normalized);
  }

  protected updateGuest(field: GuestField, value: string): void {
    const guest = this.currentGuest();
    guest[field] = value;
    guest.saved = false;
    this.guests.update((guests) => [...guests]);
  }

  protected openDate(): void {
    const iso = this.currentGuest().birthDate;
    if (iso) {
      const [year, month, day] = iso.split('-').map(Number);
      this.dateDay.set(String(day)); this.dateMonth.set(month - 1); this.dateYear.set(String(year));
    } else {
      this.dateDay.set(''); this.dateMonth.set(null); this.dateYear.set('');
    }
    this.dateStep.set(1); this.dateError.set(''); this.modal.set('date');
  }

  protected dateNext(): void {
    if (this.dateStep() === 1) {
      const day = Number(this.dateDay());
      if (!Number.isInteger(day) || day < 1 || day > 31) { this.dateError.set(this.copy().invalidDay); return; }
      this.dateError.set(''); this.dateStep.set(2); return;
    }
    if (this.dateStep() === 2) {
      if (this.dateMonth() === null) { this.dateError.set(this.copy().monthRequired); return; }
      this.dateError.set(''); this.dateStep.set(3); return;
    }
    const day = Number(this.dateDay()); const month = this.dateMonth(); const year = Number(this.dateYear());
    if (!Number.isInteger(year) || month === null || !this.hasValidAge(year, month, day)) { this.dateError.set(this.copy().invalidYear); return; }
    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) { this.dateError.set(this.copy().invalidDate); return; }
    const guest = this.currentGuest();
    guest.birthDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    guest.birthDateLabel = new Intl.DateTimeFormat(this.locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    guest.saved = false;
    this.guests.update((guests) => [...guests]);
    this.modal.set(null);
  }

  protected selectMonth(month: number): void { this.dateMonth.set(month); this.dateError.set(''); }
  protected setDateNumber(part: 'day' | 'year', value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, part === 'day' ? 2 : 4);
    part === 'day' ? this.dateDay.set(digits) : this.dateYear.set(digits);
    this.dateError.set('');
  }

  protected openPicker(type: 'nationality' | 'birthPlace'): void { this.searchQuery.set(''); this.modal.set(type); }
  protected selectCodeItem(item: CodeItem): void {
    const guest = this.currentGuest();
    if (this.modal() === 'nationality') {
      const changed = guest.nationalityCode !== item.code;
      guest.nationalityCode = item.code; guest.nationality = item.description;
      if (changed) { guest.issuingCountryCode = item.code; guest.birthPlaceCode = ''; guest.birthPlace = ''; }
    } else {
      guest.birthPlaceCode = item.code; guest.birthPlace = item.description;
    }
    guest.saved = false;
    this.guests.update((guests) => [...guests]);
    this.modal.set(null);
  }

  protected documentLabel(code: string, fallback = ''): string {
    return documentTypeLabel(code, this.language(), fallback);
  }

  protected openDocumentTypes(): void { this.selectedDocumentCode.set(this.currentGuest().documentTypeCode); this.modal.set('documentType'); }
  protected confirmDocumentType(): void {
    const selected = this.documentTypes().find((document) => document.code === this.selectedDocumentCode());
    if (!selected) return;
    const guest = this.currentGuest(); guest.documentTypeCode = selected.code; guest.documentType = selected.description; guest.saved = false;
    this.guests.update((guests) => [...guests]); this.modal.set(null);
  }

  protected previous(): void {
    if (this.guestIndex() === 0) this.mode.set('intro');
    else this.guestIndex.update((index) => index - 1);
    this.scrollTop();
  }

  protected async next(): Promise<void> {
    if (this.apiSaving() || this.apiLoading()) return;
    const missing = this.missingFields(this.currentGuest(), this.guestIndex());
    if (missing.length) { this.showAlert(this.copy().missingTitle, this.copy().missingText, missing); return; }
    if (!await this.saveCurrent()) return;
    if (this.guestIndex() === this.totalGuests - 1) { this.showCompletion(); return; }
    const nextIndex = this.guestIndex() + 1;
    const first = this.guests()[0]; const nextGuest = this.guests()[nextIndex];
    if (!nextGuest.nationalityCode && first.nationalityCode) {
      nextGuest.nationalityCode = first.nationalityCode; nextGuest.nationality = first.nationality;
    }
    this.guestIndex.set(nextIndex); this.scrollTop();
  }

  protected async finish(): Promise<void> {
    if (this.apiSaving() || this.apiLoading()) return;
    if (this.isCurrentComplete() && !await this.saveCurrent()) return;
    if (!this.guests()[0].saved) { this.showAlert(this.copy().firstRequiredTitle, this.copy().firstRequiredText); return; }
    if (this.registeredCount() === this.totalGuests) { this.showCompletion(); return; }
    this.alertCompletesRegistration.set(true);
    this.showAlert(this.copy().partialTitle, this.text(this.copy().partialText, { registered: this.registeredCount(), total: this.totalGuests }));
  }

  protected closeAlert(): void {
    const complete = this.alertCompletesRegistration();
    this.modal.set(null); this.alertCompletesRegistration.set(false);
    if (complete) this.completed.emit();
  }

  protected isCurrentComplete(): boolean { return this.missingFields(this.currentGuest(), this.guestIndex()).length === 0; }
  protected isItaly(): boolean { return this.currentGuest().nationalityCode === '100000100'; }

  private showCompletion(): void {
    this.alertCompletesRegistration.set(true);
    this.showAlert(this.copy().completeTitle, this.copy().completeText);
  }

  private showAlert(title: string, message: string, items: string[] = []): void {
    this.alertTitle.set(title); this.alertMessage.set(message); this.alertItems.set(items); this.modal.set('alert');
  }

  private missingFields(guest: GuestRecord, index: number): string[] {
    const fields: Array<[boolean, string]> = [
      [!!guest.surname, this.copy().surname], [!!guest.name, this.copy().name], [!!guest.gender, this.copy().gender],
      [!!guest.birthDate, this.copy().birthDate], [!!guest.nationalityCode, this.copy().nationality]
    ];
    if (guest.nationalityCode === '100000100') fields.push([!!guest.birthPlaceCode, this.copy().birthPlace]);
    if (index === 0) fields.push([!!guest.documentTypeCode, this.copy().documentType], [!!guest.documentNumber, this.copy().documentNumber]);
    return fields.filter(([present]) => !present).map(([, label]) => label);
  }

  private hasValidAge(year: number, month: number, day: number): boolean {
    const arrival = this.booking().host_arrival;
    const reference = arrival ? new Date(arrival.slice(0, 10) + 'T12:00:00') : new Date();
    let age = reference.getFullYear() - year;
    if (reference.getMonth() < month || (reference.getMonth() === month && reference.getDate() < day)) age--;
    return age > 10 && age < 110;
  }

  private asciiLetters(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[Łł]/g, 'L').replace(/[Øø]/g, 'O').replace(/[Đđ]/g, 'D').replace(/[Þþ]/g, 'TH').replace(/[Œœ]/g, 'OE').replace(/ß/g, 'SS').replace(/[^A-Za-z ]/g, '').replace(/\s+/g, ' ').toUpperCase();
  }
  private asciiLettersAndNumbers(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[Łł]/g, 'L').replace(/[Øø]/g, 'O').replace(/[Đđ]/g, 'D').replace(/[Þþ]/g, 'TH').replace(/[Œœ]/g, 'OE').replace(/ß/g, 'SS').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
  private normalizeForSearch(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim(); }
  private scrollTop(): void { window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0); }

  private restoreState(): { guestIndex: number; guests: GuestRecord[] } {
    try {
      const raw = window.sessionStorage.getItem(this.storageKey);
      if (!raw) return { guestIndex: 0, guests: Array.from({ length: this.totalGuests }, EMPTY_GUEST) };
      const parsed = JSON.parse(raw) as { guestIndex?: number; guests?: Partial<GuestRecord>[] };
      const guests = Array.from({ length: this.totalGuests }, (_, index) => ({ ...EMPTY_GUEST(), ...(parsed.guests?.[index] ?? {}) }));
      const guestIndex = Math.max(0, Math.min(this.totalGuests - 1, Number(parsed.guestIndex) || 0));
      return { guestIndex, guests };
    } catch {
      return { guestIndex: 0, guests: Array.from({ length: this.totalGuests }, EMPTY_GUEST) };
    }
  }

  private async loadCsv(path: string): Promise<Array<CodeItem & { endDate?: string }>> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return (await response.text()).split(/\r?\n/).slice(1).filter(Boolean).map((line) => {
      const [code, description, , endDate] = line.split(',');
      return { code, description, endDate };
    });
  }
}
