import { AfterViewInit, Component, ElementRef, OnDestroy, computed, input, output, viewChild } from '@angular/core';
import { RegistrationLanguage } from '../guest-registration/registration-copy';
import { PRIVACY_COPY, PRIVACY_NOTICE_VERSION } from './privacy-copy';

@Component({
  selector: 'app-privacy-notice',
  template: `
    <dialog #dialog aria-labelledby="privacy-notice-title" (cancel)="cancel($event)">
      <header>
        <div><h2 id="privacy-notice-title" tabindex="-1">{{ copy().title }}</h2>
          <small>{{ copy().versionLabel }} {{ version }}</small></div>
        <button type="button" (click)="closed.emit()">{{ copy().close }}</button>
      </header>
      <div class="notice-body" tabindex="0" [attr.aria-label]="copy().title">
        @for (section of copy().sections; track section.title) {
          <section><h3>{{ section.title }}</h3><p>{{ section.text }}</p></section>
        }
        <p><a href="mailto:info@endimension.eu">info@endimension.eu</a></p>
        <p><a href="https://www.garanteprivacy.it/" target="_blank" rel="noopener noreferrer">Garante per la protezione dei dati personali</a></p>
      </div>
      <footer><button type="button" (click)="closed.emit()">{{ copy().close }}</button></footer>
    </dialog>
  `,
  styles: `
    dialog { box-sizing: border-box; color: #18352f; background: #fff; border: 0; border-radius: 20px;
      width: min(640px, calc(100vw - 24px)); max-width: none; height: min(850px, 90dvh);
      max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 24px); padding: 0; }
    dialog[open] { display: flex; flex-direction: column; }
    dialog::backdrop { background: rgb(20 35 45 / 65%); }
    header, footer { padding: 16px; flex: 0 0 auto; background: #f5faf7; }
    header { display: flex; align-items: start; justify-content: space-between; gap: 12px; border-bottom: 1px solid #dbe6e1; }
    footer { border-top: 1px solid #dbe6e1; text-align: right; }
    h2 { font-size: 21px; margin: 0 0 6px; overflow-wrap: anywhere; }
    h3 { font-size: 18px; margin: 24px 0 8px; }
    section:first-child h3 { margin-top: 0; }
    p { font-size: 16px; line-height: 1.6; margin: 0 0 12px; overflow-wrap: anywhere; white-space: pre-line; }
    .notice-body { min-height: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 20px; }
    button { min-height: 44px; padding: 10px 16px; border: 1px solid #20755f; background: #fff;
      color: #155545; border-radius: 12px; font: inherit; cursor: pointer; }
    a { color: #155545; }
    :focus-visible { outline: 3px solid #20755f; outline-offset: 3px; }
  `
})
export class PrivacyNoticeComponent implements AfterViewInit, OnDestroy {
  readonly language = input<RegistrationLanguage>('it');
  readonly closed = output<void>();
  protected readonly copy = computed(() => PRIVACY_COPY[this.language()]);
  protected readonly version = PRIVACY_NOTICE_VERSION;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private opener: HTMLElement | null = null;
  private previousOverflow = '';

  ngAfterViewInit(): void {
    const dialog = this.dialog().nativeElement;
    const document = dialog.ownerDocument;
    this.opener = document.activeElement as HTMLElement | null;
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal(); // Native modal provides keyboard focus containment and background isolation.
    dialog.querySelector<HTMLElement>('h2')?.focus();
  }

  protected cancel(event: Event): void { event.preventDefault(); this.closed.emit(); }

  ngOnDestroy(): void {
    const dialog = this.dialog().nativeElement;
    dialog.close();
    dialog.ownerDocument.body.style.overflow = this.previousOverflow;
    if (this.opener?.isConnected) this.opener.focus();
  }
}
