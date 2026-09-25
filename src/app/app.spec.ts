import { PRIVACY_COPY, PRIVACY_NOTICE_VERSION } from './privacy/privacy-copy';
import { TEST_BOOKING, TEST_PROGRESS } from './testing/booking.fixture';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { GuestRegistrationComponent } from './guest-registration/guest-registration.component';

describe('App', () => {
  beforeEach(async () => {
    window.scrollTo = () => undefined;
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
    window.sessionStorage.clear();
    window.history.replaceState({}, '', '/?id=0&key=TESTPNR');
    let savedProgress = { ...TEST_PROGRESS, language: null as string | null, completedSteps: [] as number[] };
    globalThis.fetch = async (url, options) => {
      if (String(url).includes('sci_progress')) {
        const body = JSON.parse(options!.body as string);
        savedProgress = { ...savedProgress, ...(body.language ? { language: body.language } : {}),
          completedSteps: body.step ? Array.from({ length: body.step }, (_, i) => i + 1) : savedProgress.completedSteps };
        return Response.json({ success: true, progress: savedProgress });
      }
      if (String(url).includes('sci_privacy')) savedProgress.privacyAccepted = JSON.parse(options!.body as string).acknowledged;
      return String(url).includes('sci_login')
      ? Response.json({ success: true, progress: TEST_PROGRESS, token: 'test-token', booking: TEST_BOOKING })
      : String(url).includes('sci_guests')
      ? Response.json({ success: true, guests: [] })
      : String(url).includes('sci_privacy')
      ? Response.json({ success: true })
      : new Response('Codice,Descrizione,Provincia,DataFineVal\n100000100,ITALIA,ES,\n');
    };
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => window.history.replaceState({}, '', '/'));

  it('uses the server language and lets the guest change it', async () => {
    globalThis.fetch = async () => Response.json({ success: true, progress: TEST_PROGRESS, token: 'token', booking: { ...TEST_BOOKING, lang: 'en' } });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Welcome home');
    expect(element.querySelector('[aria-pressed="true"]')?.textContent).toContain('English');
    element.querySelector<HTMLButtonElement>('.language-option')!.click();
    await fixture.whenStable();
    expect(element.querySelector('h1')?.textContent).toContain('La tua privacy');
  });

  it('blocks all check-in screens when the PNR is invalid', async () => {
    globalThis.fetch = async () => Response.json({ success: false, errorcode: 'BAD_BOOKING_CODE' }, { status: 404 });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('BAD BOOKING CODE !');
    expect(element.querySelector('.language-option')).toBeNull();
    element.querySelector<HTMLButtonElement>('.brand')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.language-option')).toBeNull();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the language selection', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Benvenuto a casa');
    expect(compiled.querySelectorAll('.language-option')).toHaveLength(10);
  });

  it('should show all four steps and unlock them in sequence', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    (compiled.querySelector('.language-option') as HTMLButtonElement).click();
    await fixture.whenStable();
    (compiled.querySelector('.button-primary') as HTMLButtonElement).click();
    await fixture.whenStable();

    let steps = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.step-card'));
    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.disabled)).toEqual([false, true, true, true]);

    steps[0].click();
    await fixture.whenStable();
    expect(compiled.querySelector('.start-button')).toBeTruthy();

    const registration = fixture.debugElement.query(By.directive(GuestRegistrationComponent)).componentInstance as GuestRegistrationComponent;
    registration.completed.emit();
    await fixture.whenStable();

    steps = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.step-card'));
    expect(steps.map((step) => step.disabled)).toEqual([false, false, true, true]);

    steps[1].click();
    await fixture.whenStable();
    expect(compiled.querySelector('app-arrival h1')?.textContent).toContain('Vicolo Del Curato 12');
    (compiled.querySelector('.map-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    steps = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.step-card'));
    expect(steps[2].disabled).toBe(true);

    steps[1].click();
    await fixture.whenStable();
    (compiled.querySelector('.complete-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    steps = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.step-card'));
    expect(steps.map((step) => step.disabled)).toEqual([false, false, false, true]);
  });
  it('logs explicit exit and acknowledgements with version and language', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.language-option')!.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('.danger')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.journey-screen')).toBeNull();
    expect(element.querySelector('.stop-art')).toBeTruthy();
    element.querySelector<HTMLButtonElement>('.message-screen .button-primary')!.click();
    await fixture.whenStable();
    for (let i = 0; i < 2; i++) {
      element.querySelector<HTMLButtonElement>('.privacy-screen .button-primary')!.click();
      await fixture.whenStable();
      expect(element.querySelector('.journey-screen')).toBeTruthy();
      element.querySelector<HTMLButtonElement>('.back-button')!.click();
      await fixture.whenStable();
    }
    const calls = fetch.mock.calls.filter(([url]) => String(url).endsWith('/sci_privacy'));
    expect(calls.map(([, options]) => JSON.parse(options!.body as string))).toEqual([
      { acknowledged: false, noticeVersion: PRIVACY_NOTICE_VERSION, language: 'it' },
      { acknowledged: true, noticeVersion: PRIVACY_NOTICE_VERSION, language: 'it' },
      { acknowledged: true, noticeVersion: PRIVACY_NOTICE_VERSION, language: 'it' }
    ]);
    expect(calls.every(([, options]) => (options!.headers as Record<string, string>)['Authorization'] === 'Bearer test-token')).toBe(true);
  });

  it('waits for persistence, prevents duplicate clicks and allows retry after failure', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.language-option')!.click();
    await fixture.whenStable();
    let finish!: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const accept = element.querySelector<HTMLButtonElement>('.privacy-screen .button-primary')!;
    accept.click();
    accept.click();
    fixture.detectChanges();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(accept.disabled).toBe(true);
    expect(element.querySelector<HTMLButtonElement>('.back-button')!.disabled).toBe(true);
    expect(element.querySelector('.journey-screen')).toBeNull();
    finish(Response.json({ success: false }, { status: 503 }));
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"]')).toBeTruthy();
    });
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Impossibile salvare');
    expect(accept.disabled).toBe(false);
    fetch.mockResolvedValue(Response.json({ success: true }));
    accept.click();
    await fixture.whenStable();
    expect(element.querySelector('.journey-screen')).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('resumes directly on the map with the saved language and completed steps', async () => {
    const progress = { ...TEST_PROGRESS, language: 'en', privacyAccepted: true, completedSteps: [1, 2] };
    globalThis.fetch = async () => Response.json({ success: true, token: 'token', booking: TEST_BOOKING, progress });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.language-screen')).toBeNull();
    expect(element.querySelector('.privacy-screen')).toBeNull();
    expect(element.querySelector('h1')?.textContent).toContain('Four stops');
    expect(element.querySelector('.progress-card')?.textContent).toContain('50%');
    expect(Array.from(element.querySelectorAll<HTMLButtonElement>('.step-card')).map(b => b.disabled)).toEqual([false, false, false, true]);
    element.querySelector<HTMLButtonElement>('.language-chip')!.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('.language-option')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.journey-screen')).toBeTruthy();
    expect(element.querySelector('.progress-card')?.textContent).toContain('50%');
  });

  it('keeps the privacy gate after a refusal and remembers the chosen language', async () => {
    globalThis.fetch = async () => Response.json({ success: true, token: 'token', booking: TEST_BOOKING,
      progress: { ...TEST_PROGRESS, language: 'fr', completedSteps: [1] } });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.privacy-screen')).toBeTruthy();
    expect(element.querySelector('.journey-screen')).toBeNull();
    expect(element.querySelector('h1')?.textContent).toContain('vie privée');
  });

  it('does not unlock a step before saving succeeds and retries the same completion', async () => {
    const progress = { ...TEST_PROGRESS, language: 'it', privacyAccepted: true, completedSteps: [1, 2] };
    globalThis.fetch = async () => Response.json({ success: true, token: 'token', booking: TEST_BOOKING, progress });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelectorAll<HTMLButtonElement>('.step-card')[2].click();
    await fixture.whenStable();
    let finish!: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(resolve => finish = resolve));
    const button = element.querySelector<HTMLButtonElement>('.detail-actions .button-primary')!;
    button.click(); button.click();
    fixture.detectChanges();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(element.querySelector('main')?.hasAttribute('inert')).toBe(true);
    finish(Response.json({ success: false }, { status: 503 }));
    await fixture.whenStable();
    expect(element.querySelector('.journey-screen')).toBeNull();
    await vi.waitFor(() => { fixture.detectChanges(); expect(element.querySelector('[role="alert"]')).toBeTruthy(); });
    fetch.mockResolvedValue(Response.json({ success: true, progress: { ...progress, completedSteps: [1, 2, 3] } }));
    element.querySelector<HTMLButtonElement>('.progress-dialog button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.progress-card')?.textContent).toContain('75%');
    expect(element.querySelectorAll<HTMLButtonElement>('.step-card')[3].disabled).toBe(false);
    expect(fetch.mock.calls.map(([, options]) => JSON.parse(options!.body as string))).toEqual([{ step: 3 }, { step: 3 }]);
  });

  it('offers the full notice without logging its opening or requiring scrolling to continue', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.language-option')!.click();
    await fixture.whenStable();
    const read = element.querySelector<HTMLButtonElement>('.privacy-read')!;
    read.focus(); read.click();
    await fixture.whenStable();
    const dialog = element.querySelector<HTMLDialogElement>('dialog')!;
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(dialog.textContent).toContain('EnDimension s.r.l.');
    expect(dialog.textContent).toContain('ROSS1000');
    expect(dialog.textContent).toContain(PRIVACY_NOTICE_VERSION);
    expect(dialog.querySelectorAll('section')).toHaveLength(8);
    expect(element.querySelector('main')?.hasAttribute('inert')).toBe(true);
    expect(fetch.mock.calls.filter(([url]) => String(url).endsWith('/sci_privacy'))).toHaveLength(0);
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
    const next = element.querySelector<HTMLButtonElement>('.privacy-screen .button-primary')!;
    expect(next.textContent).toContain('Ho letto, continua');
    expect(next.disabled).toBe(false);
    expect(element.textContent).not.toContain('Sì, accetto');
  });

  it('requires acknowledgement of this version even after a legacy acceptance, preserving progress', async () => {
    globalThis.fetch = async () => Response.json({ success: true, token: 'token', booking: TEST_BOOKING,
      progress: { ...TEST_PROGRESS, language: 'it', privacyAccepted: true, privacyNoticeVersion: '', completedSteps: [1, 2] } });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.privacy-screen')).toBeTruthy();
    expect(element.querySelector('app-guest-registration')).toBeNull();
    element.querySelector<HTMLButtonElement>('.privacy-screen .button-primary')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.progress-card')?.textContent).toContain('50%');
    element.querySelector<HTMLButtonElement>('.header-privacy')!.click();
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeTruthy();
    element.querySelector<HTMLButtonElement>('dialog button')!.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('.step-card')!.click();
    // Only test access to the persistent link here; mock guests for the form load.
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('.header-privacy')!.click();
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeTruthy();
  });

  it('has a complete translated notice and acknowledgement controls in every supported language', () => {
    expect(Object.keys(PRIVACY_COPY)).toHaveLength(10);
    for (const notice of Object.values(PRIVACY_COPY)) {
      expect(notice.sections).toHaveLength(8);
      expect(notice.sections.every(section => section.title && section.text.length > 30)).toBe(true);
      expect(notice.sections.map(section => section.text).join(' ')).toContain('info@endimension.eu');
      expect(notice.acknowledge.length).toBeGreaterThan(0);
      expect(notice.exit.length).toBeGreaterThan(0);
    }
  });

});
