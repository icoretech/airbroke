/*
  Warnings:

  - Made the column `message` on table `occurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `backtrace` on table `occurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `context` on table `occurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment` on table `occurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `session` on table `occurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `params` on table `occurrence` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "occurrence" ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "backtrace" SET NOT NULL,
ALTER COLUMN "context" SET NOT NULL,
ALTER COLUMN "environment" SET NOT NULL,
ALTER COLUMN "session" SET NOT NULL,
ALTER COLUMN "params" SET NOT NULL;
