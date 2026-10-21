export interface Period {
  month: number;
  year: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const TIME_ZONE = "America/Santiago";

export function currentPeriod(): Period {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);

  return { month, year };
}

export function parsePeriod(params: {
  month?: string;
  year?: string;
}): Period {
  const fallback = currentPeriod();

  const month = Number(params.month);
  const year = Number(params.year);

  return {
    month:
      Number.isInteger(month) && month >= 1 && month <= 12
        ? month
        : fallback.month,
    year:
      Number.isInteger(year) && year >= 1900 && year <= 2200
        ? year
        : fallback.year,
  };
}

export function periodKey(period: Period): string {
  return `${period.year}-${String(period.month).padStart(2, "0")}`;
}

export function periodRange(period: Period): DateRange {
  const daysInMonth = new Date(period.year, period.month, 0).getDate();

  return {
    startDate: `${periodKey(period)}-01`,
    endDate: `${periodKey(period)}-${String(daysInMonth).padStart(2, "0")}`,
  };
}

export function previousPeriod(period: Period): Period {
  return period.month === 1
    ? { month: 12, year: period.year - 1 }
    : { month: period.month - 1, year: period.year };
}

export function formatPeriod(period: Period): string {
  return `${MONTH_NAMES[period.month - 1]} ${period.year}`;
}

export function formatPeriodLabel(period: Period): string {
  return `${MONTH_NAMES[period.month - 1].toLowerCase()} de ${period.year}`;
}
