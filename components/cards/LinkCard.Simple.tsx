import type { Link } from "@/lib/db/schema";
import { LinkCard } from "./LinkCard";

export function SimpleLinkCard(props: Link) {
  return <LinkCard link={props} />;
}
