// Every place on the globe. Add an entry per city; the board and the globe both read from here.
//
// lat/lng: decimal degrees. countryCode: ISO 3166-1 alpha-2 (used for the flag when no photo is given).
// kind drives the status column on the departures board.
// story: a few sentences shown when the marker is clicked. images: paths under /public (e.g. "/cv/places/madrid-1.jpg").

export type PlaceKind = 'lived' | 'worked' | 'studied' | 'visited';

export interface Place {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  kind: PlaceKind;
  /** Free text, e.g. "2022 - now" or "Summer 2018" */
  when?: string;
  story?: string;
  images?: string[];
  /** Optional photo for the marker itself; falls back to the country flag. Use at least 512px wide, it gets scaled up when zooming. */
  markerImage?: string;
}

// Cities for Austria, the Netherlands, the USA and Colombia are placeholders taken from the CV's country list; fix as needed.
export const places: Place[] = [
  {
    id: 'madrid',
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'es',
    lat: 40.4168,
    lng: -3.7038,
    kind: 'lived',
    when: '2021 - now',
    story: 'Home base. CTO at Audemic, teaching at Le Wagon, and now building Navar and KnowThyself360 from here.',
  },
  {
    id: 'vienna',
    city: 'Vienna',
    country: 'Austria',
    countryCode: 'at',
    lat: 48.2082,
    lng: 16.3738,
    kind: 'lived',
  },
  {
    id: 'amsterdam',
    city: 'Amsterdam',
    country: 'The Netherlands',
    countryCode: 'nl',
    lat: 52.3676,
    lng: 4.9041,
    kind: 'lived',
  },
  {
    id: 'new-delhi',
    city: 'New Delhi',
    country: 'India',
    countryCode: 'in',
    lat: 28.6139,
    lng: 77.209,
    kind: 'lived',
    when: '2018 - 2019',
    story: 'Business analyst at editorji, a video news startup. Competitor research, reports for the founder, and a lot of Mandarin.',
  },
  {
    id: 'shanghai',
    city: 'Shanghai',
    country: 'China',
    countryCode: 'cn',
    lat: 31.2304,
    lng: 121.4737,
    kind: 'worked',
    when: 'Summer 2018',
    story: 'Internship at IT Consultis: investor deck, financial projections, and a live KPI dashboard on the office wall.',
  },
  {
    id: 'usa',
    city: 'United States',
    country: 'USA',
    countryCode: 'us',
    lat: 39.8283,
    lng: -98.5795,
    kind: 'lived',
  },
  {
    id: 'colombia',
    city: 'Bogotá',
    country: 'Colombia',
    countryCode: 'co',
    lat: 4.711,
    lng: -74.0721,
    kind: 'lived',
  },
];

export const kindLabel: Record<PlaceKind, string> = {
  lived: 'LIVED',
  worked: 'WORKED',
  studied: 'STUDIED',
  visited: 'VISITED',
};
