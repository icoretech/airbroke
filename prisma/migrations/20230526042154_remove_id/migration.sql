-- DropIndex
DROP INDEX "hourly_occurrences_occurrence_id_interval_start_interval_en_idx";

-- AlterTable
ALTER TABLE "hourly_occurrences" DROP CONSTRAINT "hourly_occurrences_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "hourly_occurrences_occurrence_id_interval_start_interval_en_key" ON "hourly_occurrences"("occurrence_id", "interval_start", "interval_end");
