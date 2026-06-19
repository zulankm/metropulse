// ETA Engine for Metro Pulse PWA

export class Schedule {
  constructor(data) {
    this.lineId = data.lineId;
    this.lineName = data.lineName;
    this.operatingHours = data.operatingHours;
    this.frequency = data.frequency;
    this.stations = data.stations || [];
  }
}

function minutesSinceMidnight(dt) {
  return dt.getHours() * 60 + dt.getMinutes();
}

function parseHM(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

function isSunday(dt) {
  return dt.getDay() === 0;
}

function isSaturday(dt) {
  return dt.getDay() === 6;
}

export function getFrequency(dt, schedule) {
  const isWknd = isSunday(dt) || isSaturday(dt);
  if (isWknd) {
    return 15; // "10 to 15" for weekend, using 15
  }
  
  const m = minutesSinceMidnight(dt);
  // Weekday Peak: 08:00-11:00 (480-660) and 17:00-20:00 (1020-1200)
  if ((m >= 480 && m <= 660) || (m >= 1020 && m <= 1200)) {
    return 10; // "7.5 to 10" for peak, using 10
  }
  return 15; // Weekday off-peak is 15
}

export function minutesUntilNextDeparture(schedule, now = new Date(), stationIndex = 0, isTowardsDepot = true) {
  const sun = isSunday(now);
  const firstHM = sun ? schedule.operatingHours.sunday.first_train : schedule.operatingHours.monday_to_saturday.first_train;
  const lastHM = sun ? schedule.operatingHours.sunday.last_train : schedule.operatingHours.monday_to_saturday.last_train;

  const first = parseHM(firstHM);
  const last = parseHM(lastHM);
  const nowM = minutesSinceMidnight(now);

  // Calculate correct travel offset based on the train's starting point
  const totalStations = schedule.stations.length > 0 ? schedule.stations.length : 21;
  const offsetMins = isTowardsDepot ? (stationIndex * 3) : ((totalStations - 1 - stationIndex) * 3);
  
  const stationFirst = first + offsetMins;
  const stationLast = last + offsetMins;

  if (nowM < stationFirst) {
    return stationFirst - nowM;
  }

  if (nowM > stationLast) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSun = isSunday(tomorrow);
    const tomorrowFirstHM = tomorrowSun ? schedule.operatingHours.sunday.first_train : schedule.operatingHours.monday_to_saturday.first_train;
    return (24 * 60 - nowM) + parseHM(tomorrowFirstHM) + offsetMins;
  }

  const freq = getFrequency(now, schedule);
  const minutesPastFirst = nowM - stationFirst;
  const nextDepartureAtStation = stationFirst + (Math.ceil(minutesPastFirst / freq) * freq);

  if (nextDepartureAtStation > stationLast) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSun = isSunday(tomorrow);
    const tomorrowFirstHM = tomorrowSun ? schedule.operatingHours.sunday.first_train : schedule.operatingHours.monday_to_saturday.first_train;
    return (24 * 60 - nowM) + parseHM(tomorrowFirstHM) + offsetMins;
  }

  return nextDepartureAtStation - nowM;
}

export function getNextDepartureTime(schedule, now = new Date(), stationIndex = 0, isTowardsDepot = true) {
  const waitMinutes = minutesUntilNextDeparture(schedule, now, stationIndex, isTowardsDepot);
  const nextDate = new Date(now.getTime());
  nextDate.setMinutes(nextDate.getMinutes() + waitMinutes);
  nextDate.setSeconds(0);
  nextDate.setMilliseconds(0);
  return nextDate;
}

export function formatTime(dt) {
  if (!dt) return "";
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function getOperatingStatus(schedule, now = new Date()) {
  const sun = isSunday(now);
  const firstHM = sun ? schedule.operatingHours.sunday.first_train : schedule.operatingHours.monday_to_saturday.first_train;
  const lastHM = sun ? schedule.operatingHours.sunday.last_train : schedule.operatingHours.monday_to_saturday.last_train;

  const first = parseHM(firstHM);
  const last = parseHM(lastHM);
  const nowM = minutesSinceMidnight(now);
  const freq = getFrequency(now, schedule);

  let status = "Operating";
  if (nowM < first) status = "Opening Soon";
  if (nowM > last) status = "Closed";

  return {
    status,
    firstHM,
    lastHM,
    freq
  };
}