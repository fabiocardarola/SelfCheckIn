import { PRIVACY_NOTICE_VERSION } from '../privacy/privacy-copy';
import { Booking } from '../booking.service';
export const TEST_BOOKING: Booking = {
  fkbooking: 123, pnr: 'TESTPNR', customer: 'Fabio Cardarola', people: 4, nights: 6,
  host_arrival: '2026-09-16 14:00:00', host_departure: '2026-09-22 10:00:00', lang: 'it',
  apartment: 'Test apartment', provenienza: 'Test', nationalityDescription: 'ITALIA', booked_on: null,
  address: 'Vicolo Del Curato 12', city: 'ROMA', cap: '00186', lat: 41.9004, lng: 12.4682
};

export const TEST_PROGRESS = { language: null, privacyAccepted: false, privacyNoticeVersion: PRIVACY_NOTICE_VERSION, completedSteps: [], completedAt: {} };
