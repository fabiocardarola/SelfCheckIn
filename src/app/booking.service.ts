import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { API_BASE_URL } from './api.config';

export interface Booking {
  fkbooking: number; pnr: string; customer: string; people: number; nights: number;
  host_arrival: string | null; host_departure: string | null; lang: string;
  apartment: string; provenienza: string; nationalityDescription: string; booked_on: string | null;
  address: string; city: string; cap: string; lat: number | null; lng: number | null;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly document = inject(DOCUMENT);
  private token: string | null = null;
  readonly booking = signal<Booking | null>(null);
  readonly status = signal<'loading' | 'ready' | 'bad-code' | 'error'>('loading');

  async login(): Promise<void> {
    this.status.set('loading');
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
      this.token = result.token;
      this.booking.set(result.booking);
      this.status.set('ready');
    } catch { this.status.set('error'); }
  }

  /** All future guest API calls go through this method to include the guest token. */
  async request<T>(method: `sci_${string}`, body: Record<string, unknown> = {}): Promise<T> {
    if (!this.token || !/^sci_[a-z_]+$/.test(method) || method === 'sci_login') throw new Error('Invalid authenticated request');
    const response = await fetch(`${API_BASE_URL}/${method}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
      body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15000)
    });
    if (response.status === 401) {
      this.token = null; this.booking.set(null); this.status.set('error');
      throw new Error('Session expired');
    }
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error('Guest API request failed');
    return result as T;
  }
}
