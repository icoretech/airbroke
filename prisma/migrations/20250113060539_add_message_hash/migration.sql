/*
  Warnings:

  - A unique constraint covering the columns `[notice_id,message_hash]` on the table `occurrences` will be added. If there are existing duplicate values, this will fail.

*/
-- 1) Drop the old unique index on (notice_id, message)
DROP INDEX IF EXISTS "occurrences_notice_id_message_key";

-- 2) Add the new column (already present from Prisma, but confirm naming)
ALTER TABLE "occurrences"
  ADD COLUMN "message_hash" TEXT;

-- 3) Populate `message_hash` for all existing rows using Postgres' md5() function.
--    This ensures there's no null for old data.
UPDATE "occurrences"
SET "message_hash" = md5("message"::text)
WHERE "message_hash" IS NULL;

-- 4) Create the new unique index
CREATE UNIQUE INDEX "occurrences_notice_id_message_hash_key"
  ON "occurrences" ("notice_id", "message_hash");
