-- Migrate from NextAuth to Better Auth schema

-- 1. accounts: rename columns and add new ones
-- Add new columns as nullable first
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "provider_id" TEXT;
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "access_token_expires_at" TIMESTAMP(3);
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "refresh_token_expires_at" TIMESTAMP(3);
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "password" TEXT;
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Populate from old columns
UPDATE "accounts" SET "account_id" = "provider_account_id" WHERE "account_id" IS NULL AND "provider_account_id" IS NOT NULL;
UPDATE "accounts" SET "provider_id" = "provider" WHERE "provider_id" IS NULL AND "provider" IS NOT NULL;

-- Make required columns non-nullable
ALTER TABLE "accounts" ALTER COLUMN "account_id" SET NOT NULL;
ALTER TABLE "accounts" ALTER COLUMN "provider_id" SET NOT NULL;

-- Drop old columns
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "provider";
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "provider_account_id";
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "type";
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "token_type";
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "session_state";
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "expires_at";

-- 2. sessions: convert from NextAuth to Better Auth format
-- Add new columns
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "token" TEXT;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "ip_address" TEXT;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "user_agent" TEXT;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Populate token from session_token if it exists
UPDATE "sessions" SET "token" = "session_token" WHERE "token" IS NULL AND "session_token" IS NOT NULL;
-- For any remaining null tokens, generate a unique value
UPDATE "sessions" SET "token" = gen_random_uuid()::TEXT WHERE "token" IS NULL;

-- Make token non-nullable and unique
ALTER TABLE "sessions" ALTER COLUMN "token" SET NOT NULL;

-- Rename expires to expires_at if needed (idempotent via DO block)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='expires') THEN
    ALTER TABLE "sessions" RENAME COLUMN "expires" TO "expires_at";
  END IF;
END $$;

-- Drop old columns
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "session_token";

-- Add unique constraint on token
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_key" ON "sessions"("token");

-- 3. users: convert from NextAuth to Better Auth format
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Convert email_verified from timestamp to boolean (idempotent)
-- Better Auth uses boolean, NextAuth uses timestamp
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email_verified' AND data_type='timestamp without time zone') THEN
    ALTER TABLE "users" ADD COLUMN "email_verified_bool" BOOLEAN NOT NULL DEFAULT false;
    UPDATE "users" SET "email_verified_bool" = true WHERE "email_verified" IS NOT NULL;
    ALTER TABLE "users" DROP COLUMN "email_verified";
    ALTER TABLE "users" RENAME COLUMN "email_verified_bool" TO "email_verified";
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email_verified') THEN
    ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Make name non-nullable (Better Auth requires it)
UPDATE "users" SET "name" = "email" WHERE "name" IS NULL;
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;

-- 4. Create verifications table (Better Auth replacement for verification_tokens)
CREATE TABLE IF NOT EXISTS "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- Drop old NextAuth verification_tokens table if it exists
DROP TABLE IF EXISTS "verification_tokens";

-- Drop old NextAuth unique constraints that no longer apply
DROP INDEX IF EXISTS "accounts_provider_provider_account_id_key";

-- 5. Drop SQL defaults on @updatedAt columns (Prisma manages these client-side)
ALTER TABLE "accounts" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "sessions" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "verifications" ALTER COLUMN "updated_at" DROP DEFAULT;
