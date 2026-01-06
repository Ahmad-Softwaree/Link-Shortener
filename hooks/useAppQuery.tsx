"use client";

import { ENUMs } from "@/lib/enums";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  getLimitFromCookie,
  setLimitCookie,
} from "@/lib/config/pagination.config";
import { useEffect, useState } from "react";

export function useAppQueryParams() {
  const [cookieLimit, setCookieLimit] = useState<number>(100);

  useEffect(() => {
    setCookieLimit(getLimitFromCookie());
  }, []);

  const [queries, setQueries] = useQueryStates({
    [ENUMs.PARAMS.PAGE]: parseAsInteger.withDefault(0),
    [ENUMs.PARAMS.LIMIT]: parseAsInteger.withDefault(cookieLimit),
    [ENUMs.PARAMS.SEARCH]: parseAsString.withDefault(""),
  });

  const removeAllQueries = () => {
    setQueries(null);
  };

  const setLimit = (limit: number) => {
    setLimitCookie(limit);
    setQueries({ limit, page: 0 });
  };

  return {
    queries,
    setQueries,
    removeAllQueries,
    setLimit,
  };
}
