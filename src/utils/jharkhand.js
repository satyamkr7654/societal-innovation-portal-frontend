/** Jharkhand's 24 districts with approximate headquarters coordinates. */
export const JHARKHAND_DISTRICTS = [
  { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
  { name: 'Chatra', lat: 24.206, lng: 84.87 },
  { name: 'Deoghar', lat: 24.4852, lng: 86.6948 },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
  { name: 'Dumka', lat: 24.2676, lng: 87.2497 },
  { name: 'East Singhbhum', lat: 22.8046, lng: 86.2029 },
  { name: 'Garhwa', lat: 24.16, lng: 83.807 },
  { name: 'Giridih', lat: 24.1913, lng: 86.3096 },
  { name: 'Godda', lat: 24.827, lng: 87.213 },
  { name: 'Gumla', lat: 23.044, lng: 84.542 },
  { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
  { name: 'Jamtara', lat: 23.963, lng: 86.802 },
  { name: 'Khunti', lat: 23.072, lng: 85.279 },
  { name: 'Koderma', lat: 24.468, lng: 85.594 },
  { name: 'Latehar', lat: 23.744, lng: 84.5 },
  { name: 'Lohardaga', lat: 23.433, lng: 84.683 },
  { name: 'Pakur', lat: 24.634, lng: 87.849 },
  { name: 'Palamu', lat: 24.04, lng: 84.07 },
  { name: 'Ramgarh', lat: 23.63, lng: 85.514 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { name: 'Sahibganj', lat: 25.238, lng: 87.636 },
  { name: 'Seraikela-Kharsawan', lat: 22.7, lng: 85.93 },
  { name: 'Simdega', lat: 22.615, lng: 84.502 },
  { name: 'West Singhbhum', lat: 22.554, lng: 85.806 },
];

// Rectangle around the state: a sanity check, not an exact boundary
const BOUNDS = { south: 21.95, north: 25.35, west: 83.3, east: 87.98 };

// Beyond this distance from its headquarters, a pin is treated as outside the district
const MAX_DISTRICT_RADIUS_KM = 90;

export const findDistrict = (name) => JHARKHAND_DISTRICTS.find((d) => d.name === name);

export function isInJharkhandArea({ lat, lng }) {
  return (
    lat >= BOUNDS.south && lat <= BOUNDS.north && lng >= BOUNDS.west && lng <= BOUNDS.east
  );
}

export function distanceKm(a, b) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function isTooFarFromDistrict(point, districtName) {
  const district = findDistrict(districtName);
  return Boolean(district) && distanceKm(point, district) > MAX_DISTRICT_RADIUS_KM;
}

/** District whose headquarters is nearest: a hint only, since borders are irregular. */
export function nearestDistrict(point) {
  return JHARKHAND_DISTRICTS.reduce((best, d) =>
    distanceKm(point, d) < distanceKm(point, best) ? d : best
  );
}
