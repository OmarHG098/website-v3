import type { Location } from '@shared/session';

export const locations: Location[] = [
  {
    slug: "downtown-miami",
    name: "Miami Downtown",
    city: "Miami",
    country: "United States",
    country_code: "US",
    latitude: 25.7617,
    longitude: -80.1918,
    region: "usa-canada",
    default_language: "en",
    timezone: "America/New_York",
    visibility: "listed",
    phone: "+1 786-416-6640",
    address: "1395 Brickell Ave, Miami, FL 33131"
  },
  {
    slug: "orlando",
    name: "Orlando",
    city: "Orlando",
    country: "United States",
    country_code: "US",
    latitude: 28.5383,
    longitude: -81.3792,
    region: "usa-canada",
    default_language: "en",
    timezone: "America/New_York",
    visibility: "listed",
    phone: "+1 407-205-1760",
    address: "100 S Orange Ave, Orlando, FL 32801"
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    city: "Los Angeles",
    country: "United States",
    country_code: "US",
    latitude: 34.0522,
    longitude: -118.2437,
    region: "usa-canada",
    default_language: "en",
    timezone: "America/Los_Angeles",
    visibility: "listed",
    phone: "+1 323-892-2050",
    address: "315 W 9th St, Los Angeles, CA 90015"
  },
  {
    slug: "austin",
    name: "Austin",
    city: "Austin",
    country: "United States",
    country_code: "US",
    latitude: 30.2672,
    longitude: -97.7431,
    region: "usa-canada",
    default_language: "en",
    timezone: "America/Chicago",
    visibility: "listed",
    phone: "+1 512-887-4460",
    address: "701 Brazos St, Austin, TX 78701"
  },
  {
    slug: "toronto",
    name: "Toronto",
    city: "Toronto",
    country: "Canada",
    country_code: "CA",
    latitude: 43.6532,
    longitude: -79.3832,
    region: "usa-canada",
    default_language: "en",
    timezone: "America/Toronto",
    visibility: "listed",
    phone: "+1 416-850-4600",
    address: "100 King St W, Toronto, ON M5X 1A9"
  },
  {
    slug: "madrid",
    name: "Madrid",
    city: "Madrid",
    country: "Spain",
    country_code: "ES",
    latitude: 40.4168,
    longitude: -3.7038,
    region: "europe",
    default_language: "es",
    timezone: "Europe/Madrid",
    visibility: "listed",
    phone: "+34 910 86 69 83",
    address: "Calle de Alcalá 54, 28014 Madrid"
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    country_code: "ES",
    latitude: 41.3851,
    longitude: 2.1734,
    region: "europe",
    default_language: "es",
    timezone: "Europe/Madrid",
    visibility: "listed",
    phone: "+34 932 20 80 80",
    address: "Carrer de Balmes 200, 08006 Barcelona"
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    city: "Lisbon",
    country: "Portugal",
    country_code: "PT",
    latitude: 38.7223,
    longitude: -9.1393,
    region: "europe",
    default_language: "en",
    timezone: "Europe/Lisbon",
    visibility: "listed",
    phone: "+351 21 123 4567",
    address: "Avenida da Liberdade 110, 1250-146 Lisboa"
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    city: "Mexico City",
    country: "Mexico",
    country_code: "MX",
    latitude: 19.4326,
    longitude: -99.1332,
    region: "latam",
    default_language: "es",
    timezone: "America/Mexico_City",
    visibility: "listed",
    phone: "+52 55 1234 5678",
    address: "Paseo de la Reforma 222, 06600 CDMX"
  },
  {
    slug: "bogota",
    name: "Bogota",
    city: "Bogota",
    country: "Colombia",
    country_code: "CO",
    latitude: 4.7110,
    longitude: -74.0721,
    region: "latam",
    default_language: "es",
    timezone: "America/Bogota",
    visibility: "listed",
    phone: "+57 1 234 5678",
    address: "Carrera 7 #71-21, Bogota"
  },
  {
    slug: "santiago",
    name: "Santiago",
    city: "Santiago",
    country: "Chile",
    country_code: "CL",
    latitude: -33.4489,
    longitude: -70.6693,
    region: "latam",
    default_language: "es",
    timezone: "America/Santiago",
    visibility: "listed",
    phone: "+56 2 1234 5678",
    address: "Av. Apoquindo 3000, Las Condes, Santiago"
  },
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    city: "Buenos Aires",
    country: "Argentina",
    country_code: "AR",
    latitude: -34.6037,
    longitude: -58.3816,
    region: "latam",
    default_language: "es",
    timezone: "America/Argentina/Buenos_Aires",
    visibility: "listed",
    phone: "+54 11 1234 5678",
    address: "Av. Corrientes 1234, Buenos Aires"
  },
  {
    slug: "caracas",
    name: "Caracas",
    city: "Caracas",
    country: "Venezuela",
    country_code: "VE",
    latitude: 10.4806,
    longitude: -66.9036,
    region: "latam",
    default_language: "es",
    timezone: "America/Caracas",
    visibility: "listed",
    phone: "+58 212 123 4567",
    address: "Av. Francisco de Miranda, Caracas"
  },
  {
    slug: "online",
    name: "Online",
    city: "Online",
    country: "Worldwide",
    country_code: "WW",
    latitude: 0,
    longitude: 0,
    region: "online",
    default_language: "en",
    timezone: "UTC",
    visibility: "listed",
    phone: "+1 786-416-6640",
    address: "Online Campus"
  }
];

export const getListedLocations = (): Location[] => 
  locations.filter(loc => loc.visibility === 'listed');

export const getLocationBySlug = (slug: string): Location | undefined =>
  locations.find(loc => loc.slug === slug);

export const getLocationsByRegion = (region: Location['region']): Location[] =>
  locations.filter(loc => loc.region === region && loc.visibility === 'listed');

export const getLocationsByLanguage = (language: 'en' | 'es'): Location[] =>
  locations.filter(loc => loc.default_language === language && loc.visibility === 'listed');
