/*
  Warnings:

  - The primary key for the `notices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `occurrences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "hourly_occurrences" DROP CONSTRAINT "hourly_occurrences_occurrence_id_fkey";

-- DropForeignKey
ALTER TABLE "notices" DROP CONSTRAINT "notices_project_id_fkey";

-- DropForeignKey
ALTER TABLE "occurrence_bookmarks" DROP CONSTRAINT "occurrence_bookmarks_occurrence_id_fkey";

-- DropForeignKey
ALTER TABLE "occurrences" DROP CONSTRAINT "occurrences_notice_id_fkey";

-- AlterTable
ALTER TABLE "hourly_occurrences" ALTER COLUMN "occurrence_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "notices" DROP CONSTRAINT "notices_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notices_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "notices_id_seq";

-- AlterTable
ALTER TABLE "occurrence_bookmarks" ALTER COLUMN "occurrence_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "occurrences" DROP CONSTRAINT "occurrences_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "notice_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "occurrences_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "occurrences_id_seq";

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projects_id_seq";

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hourly_occurrences" ADD CONSTRAINT "hourly_occurrences_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_bookmarks" ADD CONSTRAINT "occurrence_bookmarks_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
