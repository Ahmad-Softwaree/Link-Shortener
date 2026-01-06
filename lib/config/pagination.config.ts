import { getCookie, setCookie } from "./cookie.config";

const LIMIT_COOKIE_NAME = "pagination_limit";
const VALID_LIMITS = [50, 100, 150, 200] as const;
const DEFAULT_LIMIT = 100;

export const getLimitFromCookie = (): number => {
  const cookieValue = getCookie(LIMIT_COOKIE_NAME);
  if (!cookieValue) return DEFAULT_LIMIT;

  const parsedLimit = parseInt(cookieValue, 10);

  if (VALID_LIMITS.includes(parsedLimit as any)) {
    return parsedLimit;
  }

  return DEFAULT_LIMIT;
};

export const setLimitCookie = (limit: number): void => {
  if (VALID_LIMITS.includes(limit as any)) {
    setCookie(LIMIT_COOKIE_NAME, limit.toString(), 30);
  }
};
