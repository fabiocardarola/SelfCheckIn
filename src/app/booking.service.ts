import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { API_BASE_URL } from './api.config';

export interface Booking {
  fkbooking: number; pnr: string; customer: string; people: number; nights: number;
  host_arrival: string | null; host_departure: string | null; lang: string;
  apartment: string; provenienza: string; nationalityDescription: string; booked_on: string | null;
  address: string; city: string; cap: string; lat: number | null; lng: number | null;
}

export interface CheckInProgress {
  language: string | null;
  privacyAccepted: boolean;
  completedSteps: number[];
  completedAt: Record<string, string>;
}

export class GuestApiError extends Error {
  constructor(readonly code: string, readonly status: number) { super(code); }
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly document = inject(DOCUMENT);
  private token: string | null = null;
  readonly progress = signal<CheckInProgress | null>(null);
  readonly booking = signal<Booking | null>(null);
  readonly status = signal<'loading' | 'ready' | 'bad-code' | 'error'>('loading');

  async login(): Promise<void> {
    this.status.set('loading');
    this.progress.set(null);
    this.token = null;
    this.booking.set(null);
    const pnr = new URL(this.document.location.href).searchParams.get('key')?.trim();
    if (!pnr || pnr.length > 80) { this.status.set('bad-code'); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/sci_login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr }), cache: 'no-store', signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (result.errorcode === 'BAD_BOOKING_CODE') { this.status.set('bad-code'); return; }
      if (!response.ok || !result.success || typeof result.token !== 'string' || !result.token
          || !result.booking || !Number.isInteger(result.booking.people) || result.booking.people < 1
          || !Number.isInteger(result.booking.fkbooking) || typeof result.booking.pnr !== 'string') {
        throw new Error('Invalid booking response');
      }
      this.setProgress(result.progress);
      this.token = result.token;
      this.booking.set(result.booking);
      this.status.set('ready');
    } catch { this.status.set('error'); }
  }

  private setProgress(value: CheckInProgress): void {
    if (!value || typeof value.privacyAccepted !== 'boolean'
        || !(value.language === null || typeof value.language === 'string')
        || !Array.isArray(value.completedSteps)
        || value.completedSteps.some((step, index) => step !== index + 1)) {
      throw new Error('Invalid progress response');
    }
    this.progress.set(value);
  }

  async saveProgress(body: { language: string } | { step: number }): Promise<CheckInProgress> {
    const result = await this.request<{ progress: CheckInProgress }>('sci_progress', body);
    this.setProgress(result.progress);
    return result.progress;
  }

  /** All future guest API calls go through this method to include the guest token. */
  async request<T>(method: `sci_${string}`, body: Record<string, unknown> = {}, timeoutMs = 15000): Promise<T> {
    if (!this.token || !/^sci_[a-z_]+$/.test(method) || method === 'sci_login') throw new Error('Invalid authenticated request');
    const response = await fetch(`${API_BASE_URL}/${method}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
      body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(timeoutMs)
    });
    if (response.status === 401) {
      this.token = null; this.booking.set(null); this.progress.set(null); this.status.set('error');
      throw new Error('Session expired');
    }
    const result = await response.json();
    if (!response.ok || !result.success) throw new GuestApiError(result.errorcode ?? 'SERVICE_UNAVAILABLE', response.status);
    return result as T;
  }
}
