export function formatCurrency(value: number, locale = "nl-BE", currency = "EUR") {
  return new Intl.NumberFormat(locale, {
    currency,
    style: "currency"
  }).format(value);
}

export function formatShortCurrency(value: number, locale = "nl-BE", currency = "EUR") {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

export function formatDate(value: string, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export function formatDateTime(value: string, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export function formatPercentage(value: number, locale = "nl-BE") {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "percent"
  }).format(value);
}

export function currentDateValue() {
  return new Date().toLocaleDateString("en-CA");
}
