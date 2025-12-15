// src/api.js
// API helpers, constants, and small utilities used across the app

export const COUNTRY_SETTINGS = {
  "AFGHANISTAN": { method: 3, school: 0, methodLabel: "MWL / Shafi" },
  "PAKISTAN": { method: 1, school: 1, methodLabel: "Karachi / Hanafi" },
  "UNITED STATES": { method: 2, school: 1, methodLabel: "ISNA / Hanafi" },
  "SAUDI ARABIA": { method: 4, school: 0, methodLabel: "Makkah / Shafi" },
  "BANGLADESH": { method: 1, school: 1, methodLabel: "Karachi / Hanafi" },
  "DEFAULT": { method: 2, school: 1, methodLabel: "ISNA / Hanafi" },
};

export const normalizeCityName = (city) => {
  if (!city) return "";
  let normalized = city.replace(/ \(.+\)/g, '').trim();
  normalized = normalized.replace(/ District/i, '').trim();
  normalized = normalized.replace(/ City/i, '').trim();
  normalized = normalized.replace(/ Metropolitan Area/i, '').trim();
  normalized = normalized.split(',')[0].trim();
  return normalized;
};

export const getPrayerSettings = (country) => {
  const key = (country || "").toString().toUpperCase();
  return COUNTRY_SETTINGS[key] || COUNTRY_SETTINGS["DEFAULT"];
};

/**
 * Fetch prayer times using coordinates (preferred for accuracy)
 * Returns an object with keys: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
 */
export async function getPrayerTimesByCoords(latitude, longitude, method = 2, school = 1) {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&method=${encodeURIComponent(method)}&school=${encodeURIComponent(school)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prayer API failed: ${res.status}`);
  const data = await res.json();

  if (!data || !data.data || !data.data.timings) {
    throw new Error("Invalid data structure from prayer API.");
  }

  const t = data.data.timings;
  const meta = data.data.meta;

  return {
    timings: {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    },
    meta: meta
  };
}

/**
 * Fallback: fetch by city + country (less accurate than coords, but kept for fallback)
 * usage: getPrayerTimesByCity('Kabul', 'Afghanistan', method, school)
 */
export async function getPrayerTimesByCity(city, country, method = 2, school = 1) {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${encodeURIComponent(method)}&school=${encodeURIComponent(school)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prayer API failed: ${res.status}`);
  const data = await res.json();

  if (!data || !data.data || !data.data.timings) {
    throw new Error("Invalid data structure from prayer API (city).");
  }

  const t = data.data.timings;
  const meta = data.data.meta;

  return {
    timings: {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    },
    meta: meta
  };
}
