const getUNIXTimeNow = () => {
  return Date.now();
};

const UNIXToTime = (unix) => {
  const date = new Date(unix);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const UNIXToDate = (unix) => {
  const date = new Date(unix);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}`;
};

const millisToText = (millis) => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  if (millis < 1000) {
    return `${millis}ms`;
  } else if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes}m`;
    else return `${minutes}m ${remainingSeconds}s`;
  }
};

export { getUNIXTimeNow, UNIXToTime, UNIXToDate, millisToText };
