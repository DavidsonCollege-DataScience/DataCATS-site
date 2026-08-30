// Maps a country's common English name (as used in a consultant's `homeCountry` field)
// to its ISO 3166-1 alpha-2 code, so we can render a Twemoji flag next to it. Twemoji
// (not native OS emoji fonts) is used because flag rendering on native emoji fonts is
// inconsistent across platforms — Windows in particular has historically shown plain
// two-letter codes instead of an actual flag for many countries.
//
// Add more entries here as new consultants/faculty list new countries. Unmapped
// countries just render without a flag rather than erroring.
const COUNTRY_TO_ISO_CODE: Record<string, string> = {
  Argentina: 'AR',
  Australia: 'AU',
  Austria: 'AT',
  Bangladesh: 'BD',
  Belgium: 'BE',
  Bhutan: 'BT',
  Bolivia: 'BO',
  Brazil: 'BR',
  Bulgaria: 'BG',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  Ethiopia: 'ET',
  Finland: 'FI',
  France: 'FR',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Guatemala: 'GT',
  Honduras: 'HN',
  'Hong Kong': 'HK',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  'South Korea': 'KR',
  Kuwait: 'KW',
  Laos: 'LA',
  Lebanon: 'LB',
  Malaysia: 'MY',
  Mexico: 'MX',
  Mongolia: 'MN',
  Morocco: 'MA',
  Myanmar: 'MM',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Nigeria: 'NG',
  Norway: 'NO',
  Pakistan: 'PK',
  Panama: 'PA',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  'Puerto Rico': 'PR',
  Qatar: 'QA',
  Romania: 'RO',
  Russia: 'RU',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Singapore: 'SG',
  'South Africa': 'ZA',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sweden: 'SE',
  Switzerland: 'CH',
  Taiwan: 'TW',
  Tanzania: 'TZ',
  Thailand: 'TH',
  Turkey: 'TR',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  Uruguay: 'UY',
  Venezuela: 'VE',
  Vietnam: 'VN',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
};

const TWEMOJI_BASE_URL = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg';

function isoCodeToFlagCodepoints(isoCode: string): string {
  return isoCode
    .toUpperCase()
    .split('')
    .map((letter) => (0x1f1e6 + (letter.charCodeAt(0) - 65)).toString(16))
    .join('-');
}

// Returns a Twemoji SVG URL for the given country name, or null if the country isn't
// in the mapping above (the caller should just skip rendering a flag in that case).
export function countryFlagUrl(countryName: string): string | null {
  const isoCode = COUNTRY_TO_ISO_CODE[countryName];
  if (!isoCode) return null;
  return `${TWEMOJI_BASE_URL}/${isoCodeToFlagCodepoints(isoCode)}.svg`;
}
