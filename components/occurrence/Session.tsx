import OccurrenceKeyValuePanel from "@/components/occurrence/OccurrenceKeyValuePanel";
import { getOccurrenceById } from "@/lib/queries/occurrences";

export default async function Session({
  occurrenceId,
}: {
  occurrenceId: string;
}) {
  const occurrence = await getOccurrenceById(occurrenceId);
  if (!occurrence) {
    throw new Error("Occurrence not found");
  }

  return <OccurrenceKeyValuePanel value={occurrence.session} />;
}
