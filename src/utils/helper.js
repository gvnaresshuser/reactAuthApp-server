export const getCookieMaxAge = (expiry) => {
  const value = parseInt(expiry, 10);

  if (expiry.endsWith("s")) return value * 1000;
  if (expiry.endsWith("m")) return value * 60 * 1000;
  if (expiry.endsWith("h")) return value * 60 * 60 * 1000;
  if (expiry.endsWith("d")) return value * 24 * 60 * 60 * 1000;

  throw new Error(`Invalid expiry format: ${expiry}`);
};
