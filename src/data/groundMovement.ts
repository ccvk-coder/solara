export const groundMovementSite = {
  location: 'Field C slope',
  sensor: 'Inclinometer GM-03'
};

export const groundMovementBaseline = {
  rate: 0.8, // mm/day
  cumulative30d: 6.4, // mm
  tilt: 0.42 // degrees from vertical
};

export const movementLevels = [
{ key: 'good', label: 'Stable', max: 2, range: '< 2 mm/day' },
{ key: 'warn', label: 'Watch', max: 5, range: '2–5 mm/day' },
{ key: 'alert', label: 'Alert', max: 8, range: '> 5 mm/day' }] as
const;