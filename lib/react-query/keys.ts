export const links = {
  all: () => ["links"] as const,
  lists: () => [...links.all(), "list"] as const,
  list: (filters?: Record<string, any>) => [...links.lists(), filters] as const,
  details: () => [...links.all(), "detail"] as const,
  detail: (id: number) => [...links.details(), id] as const,
};
