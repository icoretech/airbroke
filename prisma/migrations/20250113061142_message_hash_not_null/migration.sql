/*
  Warnings:

  - Made the column `message_hash` on table `occurrences` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "occurrences" ALTER COLUMN "message_hash" SET NOT NULL;
