const getMinutesFromTimeDifferenceString = (str) => {
  try {
    const splitted = str.split(' ');
    const sign = splitted[0];

    const timeStr = splitted[1]; // in hh:mm format
    const hh_mm = timeStr.split(':');
    const hh = parseInt(hh_mm[0]);
    const mm = parseInt(hh_mm[1]);
    const sgn = sign === '+' ? 1 : -1;
    return sgn * (hh * 60 + mm);
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const zeroPad = (num, places) => {
  return String(num).padStart(places, '0')
};

const convert_minutes_to_hh_mm = (minutes) => {
  const sgn = minutes < 0 ? -1 : 1;
  minutes *= sgn;
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  const sign = sgn > 0 ? "+" : "-";
  return sign + " " + zeroPad(hh, 2) + ":" + zeroPad(mm, 2);
};

const getCurrentTimeForTimeZone = (difference_to_GMT) => {
  const current_time = new Date();

  const utc_offset_relative_to_browser = current_time.getTimezoneOffset(); // take offset before mutating it

  const time_difference_in_minutes = getMinutesFromTimeDifferenceString(difference_to_GMT);
  current_time.setMinutes(current_time.getMinutes() + time_difference_in_minutes);
  const time_in_tz = zeroPad(current_time.getUTCHours(), 2) + ":" + zeroPad(current_time.getUTCMinutes(), 2);
  const tz_difference_to_browser_in_minutes = utc_offset_relative_to_browser + time_difference_in_minutes;

  return {
    timeInTimeZone: time_in_tz,
    timeRelativeToBrowser: convert_minutes_to_hh_mm(tz_difference_to_browser_in_minutes),
  };
};

export default getCurrentTimeForTimeZone;
