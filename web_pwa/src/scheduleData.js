import timings from '../nmrc_aqua_line_timings.json';

export const stations = [
  "Sector 51", "Sector 50", "Sector 76", "Sector 101", "Sector 81",
  "NSEZ", "Sector 83", "Sector 137", "Sector 142", "Sector 143",
  "Sector 144", "Sector 145", "Sector 146", "Sector 147", "Sector 148",
  "Knowledge Park II", "Pari Chowk", "Alpha 1", "Delta 1", "GNIDA Office", "Depot"
];

export const nmrcAquaLineSchedule = {
  lineId: "nmrc_aqua",
  lineName: timings.line,
  operator: timings.operator,
  operatingHours: timings.operating_hours,
  frequency: timings.frequency,
  color: "#00BCD4",
  stations: stations
};
