import type { Session, Location, GeoData, UTMParams, WorkerMessage, WorkerResponse } from '@shared/session';
import { defaultSession, SESSION_VERSION } from '@shared/session';
import { locations } from '../lib/locations';

const IP_API_URL = 'https://ip-api.com/json';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getBrowserLanguage(navigatorJson: string): string {
  try {
    const nav = JSON.parse(navigatorJson);
    const propertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
    
    if (Array.isArray(nav.languages)) {
      for (const lang of nav.languages) {
        if (lang && lang.length >= 2) {
          return lang.substring(0, 2).toLowerCase();
        }
      }
    }
    
    for (const key of propertyKeys) {
      const lang = nav[key];
      if (lang && lang.length >= 2) {
        return lang.substring(0, 2).toLowerCase();
      }
    }
  } catch {
    // Ignore parse errors
  }
  return 'en';
}

function parseUTMParams(search: string): UTMParams {
  const params = new URLSearchParams(search);
  const utm: UTMParams = {};
  
  const utmKeys: (keyof UTMParams)[] = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'utm_url', 'utm_placement', 'utm_plan',
    'gclid', 'fbclid', 'msclkid', 'ttclid',
    'ref', 'referral', 'coupon'
  ];
  
  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  }
  
  return utm;
}

function getClosestLocation(lat: number, lon: number, filteredLocations: Location[]): Location | null {
  const listed = filteredLocations.filter(loc => loc.visibility === 'listed' && loc.slug !== 'online');
  
  if (listed.length === 0) return null;
  
  let closest: Location | null = null;
  let minDistance = Infinity;
  
  for (const loc of listed) {
    const dist = haversineDistance(lat, lon, loc.latitude, loc.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }
  
  return closest;
}

function getRegionFromCountry(countryCode: string): Location['region'] | null {
  const latamCountries = [
    'MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA',
    'CO', 'VE', 'EC', 'PE', 'BO', 'CL', 'AR', 'UY', 'PY', 'BR',
    'CU', 'DO', 'PR', 'JM', 'HT', 'TT'
  ];
  
  const europeCountries = [
    'ES', 'PT', 'FR', 'DE', 'IT', 'GB', 'IE', 'NL', 'BE', 'AT', 'CH',
    'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'GR', 'SE', 'NO', 'DK', 'FI'
  ];
  
  if (countryCode === 'US' || countryCode === 'CA') return 'usa-canada';
  if (latamCountries.includes(countryCode)) return 'latam';
  if (europeCountries.includes(countryCode)) return 'europe';
  
  return null;
}

async function fetchGeoData(): Promise<GeoData | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(IP_API_URL, { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.status !== 'success') return null;
    
    return {
      city: data.city,
      country: data.country,
      country_code: data.countryCode,
      region: data.regionName,
      timezone: data.timezone,
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch {
    return null;
  }
}

function findLocationForUser(geo: GeoData | null, browserLang: string): Location {
  const listedLocations = locations.filter(loc => loc.visibility === 'listed');
  
  if (geo?.latitude && geo?.longitude && geo?.country_code) {
    const inCountry = listedLocations.filter(
      loc => loc.country_code === geo.country_code && loc.slug !== 'online'
    );
    
    if (inCountry.length > 0) {
      const inCity = inCountry.find(loc => 
        loc.city.toLowerCase() === geo.city?.toLowerCase()
      );
      if (inCity) {
        return { ...inCity, reliable: true };
      }
      
      const closest = getClosestLocation(geo.latitude, geo.longitude, inCountry);
      if (closest) {
        return { ...closest, reliable: true };
      }
    }
    
    const region = getRegionFromCountry(geo.country_code);
    if (region && region !== 'online') {
      const inRegion = listedLocations.filter(
        loc => loc.region === region && loc.slug !== 'online'
      );
      if (inRegion.length > 0) {
        const closest = getClosestLocation(geo.latitude, geo.longitude, inRegion);
        if (closest) {
          return { ...closest, reliable: true };
        }
      }
    }
    
    const closest = getClosestLocation(
      geo.latitude, 
      geo.longitude, 
      listedLocations.filter(loc => loc.slug !== 'online')
    );
    if (closest) {
      return { ...closest, reliable: true };
    }
  }
  
  const langLocations = listedLocations.filter(
    loc => loc.default_language === (browserLang === 'es' ? 'es' : 'en') && loc.slug !== 'online'
  );
  
  if (langLocations.length > 0) {
    const defaultLoc = browserLang === 'es' 
      ? langLocations.find(loc => loc.slug === 'madrid-spain') || langLocations[0]
      : langLocations.find(loc => loc.slug === 'miami-usa') || langLocations[0];
    return { ...defaultLoc, reliable: false };
  }
  
  const miami = listedLocations.find(loc => loc.slug === 'miami-usa');
  return miami 
    ? { ...miami, reliable: false }
    : { ...listedLocations[0], reliable: false };
}

function determineLanguage(
  browserLang: string,
  location: Location | null,
  path: string
): 'en' | 'es' {
  const pathLang = path.split('/').filter(Boolean)[0];
  if (pathLang === 'es') return 'es';
  if (pathLang === 'en') return 'en';
  
  if (browserLang === 'es') return 'es';
  
  if (location?.default_language === 'es') return 'es';
  
  return 'en';
}

async function initSession(message: WorkerMessage['payload']): Promise<Session> {
  const { cachedSession, path, search, navigator } = message;
  
  const browserLang = getBrowserLanguage(navigator);
  const newUtm = parseUTMParams(search);
  
  const mergedUtm: UTMParams = {
    ...cachedSession?.utm,
    ...Object.fromEntries(
      Object.entries(newUtm).filter(([, v]) => v !== undefined)
    ),
  };
  
  let geo: GeoData | null = cachedSession?.geo || null;
  let location: Location | null = cachedSession?.location || null;
  
  const sessionAge = cachedSession?.timestamp 
    ? Date.now() - cachedSession.timestamp 
    : Infinity;
  const isStale = sessionAge > 24 * 60 * 60 * 1000;
  
  if (!geo || isStale) {
    geo = await fetchGeoData();
  }
  
  if (!location || isStale || !location.reliable) {
    location = findLocationForUser(geo, browserLang);
  }
  
  // Check for location override from query string
  const searchParams = new URLSearchParams(search);
  const locationOverride = searchParams.get('location');
  if (locationOverride) {
    const overrideLocation = locations.find(loc => loc.slug === locationOverride);
    if (overrideLocation) {
      location = { ...overrideLocation, reliable: true };
    }
  }
  
  const language = determineLanguage(browserLang, location, path);
  
  const session: Session = {
    version: SESSION_VERSION,
    initialized: true,
    location,
    language,
    browserLang,
    geo,
    utm: mergedUtm,
    consent: cachedSession?.consent || { geolocation: null },
    timestamp: Date.now(),
  };
  
  return session;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === 'INIT_SESSION') {
    const session = await initSession(event.data.payload);
    
    const response: WorkerResponse = {
      type: 'SESSION_READY',
      payload: session,
    };
    
    self.postMessage(response);
  }
};
