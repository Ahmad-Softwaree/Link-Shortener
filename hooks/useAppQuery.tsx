import { ENUMs } from "@/lib/enums";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useAppQueryParams() {
  const [queries, setQueries] = useQueryStates({
    [ENUMs.PARAMS.PAGE]: parseAsInteger.withDefault(0),
    [ENUMs.PARAMS.LIMIT]: parseAsInteger.withDefault(10),
    [ENUMs.PARAMS.SEARCH]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.STATUS]: parseAsString.withDefault(""),
  });

  const removeAllQueries = () => {
    setQueries(null);
  };

  return {
    queries,
    setQueries,
    removeAllQueries,
  };
}
