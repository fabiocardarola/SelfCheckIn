import { TEST_BOOKING } from './testing/booking.fixture';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { GuestRegistrationComponent } from './guest-registration/guest-registration.component';

describe('App', () => {
  beforeEach(async () => {
    window.scrollTo = () => undefined;
    window.sessionStorage.clear();
    window.history.replaceState({}, '', '/?id=0&key=TESTPNR');
    globalThis.fetch = async (url) => String(url).includes('sci_login')
      ? Response.json({ success: true, token: 'test-token', booking: TEST_BOOKING })
      : String(url).includes('sci_guests')
      ? Response.json({ success: true, guests: [] })
      : String(url).includes('sci_privacy')
      ? Response.json({ success: true })
      : new Response('Codice,Descrizione,Provincia,DataFineVal\n100000100,ITALIA,ES,\n');
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => window.history.replaceState({}, '', '/'));

  it('uses the server language and lets the guest change it', async () => {
    globalThis.fetch = async () => Response.json({ success: true, token: 'token', booking: { ...TEST_BOOKING, lang: 'en' } });
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
  it('logs every decision, including refusal, reconsideration and repeated acceptance', async () => {
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
      { accepted: false }, { accepted: true }, { accepted: true }
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

});
