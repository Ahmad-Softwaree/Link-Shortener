export const QUERY_KEYS = {
  LINKS: {
    ALL: "links_all",
    ONE: (id: number) => `link_${id}`,
    USER_LINKS: (userId: number) => `user_${userId}_links`,
  },
} as const;
