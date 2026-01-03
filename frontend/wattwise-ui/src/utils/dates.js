export function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export function lastNDaysRange(n = 14) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (n - 1));
  return { start: isoDate(start), end: isoDate(end) };
}
