import OccurrenceKeyValuePanel from "@/components/occurrence/OccurrenceKeyValuePanel";
import type { Occurrence } from "@/prisma/generated/client";

export default async function Params({
  occurrence,
}: {
  occurrence: Occurrence;
}) {
  return <OccurrenceKeyValuePanel value={occurrence.params} />;
}
