export type TransportMode = 'taxi' | 'ncc' | 'uber' | 'freenow' | 'transit' | 'walking';
export interface ArrivalLocation { address: string; latitude: number; longitude: number; }
export interface ArrivalConfig {
  destination: ArrivalLocation;
  origin: ArrivalLocation;
  enabled: Record<TransportMode, boolean>;
  taxi: { flatRate: number; phone: string };
  ncc: { capacity: number; price: number }[];
}

export const DEMO_GUEST_COUNT = 4;
// Coordinate di simulazione dalla guida_implementazione_checkin.md fornita dall’utente.
// FCO: punto aeroportuale indicativo; il punto di incontro va confermato con il vettore.
export const DEMO_ARRIVAL: ArrivalConfig = {
  destination: { address: 'Vicolo Del Curato 12 - 00186 ROMA', latitude: 41.9004, longitude: 12.4682 },
  origin: { address: 'Fiumicino Airport (FCO), Roma, Italia', latitude: 41.7999, longitude: 12.2462 },
  enabled: { taxi: true, ncc: true, uber: true, freenow: true, transit: true, walking: true },
  taxi: { flatRate: 55, phone: '+39 06 3570' },
  // Tariffe NCC da FCO, bagagli inclusi (RICHIESTA 018).
  ncc: [{ capacity: 2, price: 80 }, { capacity: 4, price: 90 }, { capacity: 6, price: 100 }]
};

export function nccQuote(config: ArrivalConfig, guests: number): number | null {
  if (!Number.isInteger(guests) || guests < 1) return null;
  return [...config.ncc].sort((a, b) => a.capacity - b.capacity)
    .find((vehicle) => vehicle.capacity >= guests)?.price ?? null;
}

export function directionsUrl(config: ArrivalConfig, mode: 'transit' | 'walking'): string {
  const point = (location: ArrivalLocation) => `${location.latitude},${location.longitude}`;
  const params = new URLSearchParams({
    api: '1', destination: point(config.destination), travelmode: mode
  });
  // Omitting origin lets Google Maps use the current location (or ask for it).
  if (mode === 'transit') params.set('origin', point(config.origin));
  return `https://www.google.com/maps/dir/?${params}`;
}

export function uberUrl(config: ArrivalConfig, fromFco = true): string {
  const params = new URLSearchParams({ action: 'setPickup' });
  for (const [prefix, location] of [['pickup', config.origin], ['dropoff', config.destination]] as const) {
    if (prefix === 'pickup' && !fromFco) continue;
    params.set(`${prefix}[nickname]`, location.address);
    params.set(`${prefix}[latitude]`, String(location.latitude));
    params.set(`${prefix}[longitude]`, String(location.longitude));
    params.set(`${prefix}[formatted_address]`, location.address);
  }
  return `https://m.uber.com/ul/?${params}`;
}

// Official passenger link published at https://www.free-now.com/it/.
// The provider handles app/store/web routing; no documented destination parameters.
export const FREENOW_APP_URL = 'https://m.free-now.com/JGMc';
export const FREENOW_WEB_URL = 'https://www.free-now.com/';

export const NCC_PORT_PRICE = 270;
export const NCC_WHATSAPP_PHONE = '393461098903';
