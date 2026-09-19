import { TestBed } from '@angular/core/testing';
import { BookingService } from './booking.service';
import { API_BASE_URL } from './api.config';
import { TEST_BOOKING } from './testing/booking.fixture';

describe('BookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    window.history.replaceState({}, '', '/?id=0&key=TESTPNR');
  });
  afterEach(() => { vi.restoreAllMocks(); window.history.replaceState({}, '', '/'); });

  it('uses key as PNR, keeps the token out of URLs and authenticates subsequent calls', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({ success: true, token: 'secret-token', booking: TEST_BOOKING }))
      .mockResolvedValueOnce(Response.json({ success: true, booking: TEST_BOOKING }));
    const service = TestBed.inject(BookingService);
    await service.login();
    expect(service.status()).toBe('ready');
    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE_URL}/sci_login`);
    expect(JSON.parse(fetch.mock.calls[0][1]!.body as string)).toEqual({ pnr: 'TESTPNR' });
    await service.request('sci_booking');
    expect(fetch.mock.calls[1][1]!.headers).toMatchObject({ Authorization: 'Bearer secret-token' });
    expect(fetch.mock.calls[1][0]).toBe(`${API_BASE_URL}/sci_booking`);
  });

  it('does not load simulated data or call the server when the key is missing', async () => {
    window.history.replaceState({}, '', '/?id=0');
    const fetch = vi.spyOn(globalThis, 'fetch');
    const service = TestBed.inject(BookingService);
    await service.login();
    expect(service.status()).toBe('bad-code');
    expect(service.booking()).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('distinguishes an unknown PNR from a server failure', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({ success: false, errorcode: 'BAD_BOOKING_CODE' }, { status: 404 }))
      .mockRejectedValueOnce(new TypeError('Network error'));
    const service = TestBed.inject(BookingService);
    await service.login(); expect(service.status()).toBe('bad-code');
    await service.login(); expect(service.status()).toBe('error');
  });

  it('clears the booking when a subsequent call rejects the token', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({ success: true, token: 'token', booking: TEST_BOOKING }))
      .mockResolvedValueOnce(Response.json({ success: false }, { status: 401 }));
    const service = TestBed.inject(BookingService);
    await service.login();
    await expect(service.request('sci_booking')).rejects.toThrow('Session expired');
    expect(service.booking()).toBeNull();
    await expect(service.request('sci_booking')).rejects.toThrow('Invalid authenticated request');
  });
});
