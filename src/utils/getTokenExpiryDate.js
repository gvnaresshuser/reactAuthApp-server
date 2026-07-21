export default function getTokenExpiryDate(expiry) {
  const date = new Date();

  if (expiry.endsWith("s")) {
    date.setSeconds(date.getSeconds() + parseInt(expiry));
  } else if (expiry.endsWith("m")) {
    date.setMinutes(date.getMinutes() + parseInt(expiry));
  } else if (expiry.endsWith("h")) {
    date.setHours(date.getHours() + parseInt(expiry));
  } else if (expiry.endsWith("d")) {
    date.setDate(date.getDate() + parseInt(expiry));
  }

  return date;
}
