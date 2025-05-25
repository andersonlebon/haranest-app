export function formatPrice(price: number | string, currency: string = 'USD'): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) return 'Invalid price';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function formatDate(date: string | Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(parsedDate);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function omitValues<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export const createQueryStrings = (
  queryParams:  {
    [key: string]: string | number | boolean | string[] | number[] | null | undefined | any
  }
): string => {
  if (!queryParams) return "";

  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "none" ||
      value === "all"
    ) {
      return; // Skip these values
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (
          v !== null &&
          v !== undefined &&
          v !== "" &&
          v !== "none" &&
          v !== "all"
        ) {
          searchParams.append(key, String(v));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
