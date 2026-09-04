-- Better Auth 1.7 identifies accounts by the issuer and account ID pair.
-- Preserve external account IDs; credentials are identified by their local user ID.
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "issuer" TEXT;

-- Do not invent an identity for malformed legacy rows. Credential accounts also
-- need a user ID because Better Auth 1.7 derives their account ID from it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "accounts"
    WHERE "provider_id" IS NULL
       OR btrim("provider_id") = ''
       OR (
         "provider_id" = 'credential'
         AND ("user_id" IS NULL OR btrim("user_id") = '')
       )
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      MESSAGE = 'Cannot migrate Better Auth accounts with an unknown provider or credential identity',
      DETAIL = 'Every account requires a non-empty provider_id; credential accounts also require a non-empty user_id.';
  END IF;
END $$;

UPDATE "accounts"
SET "account_id" = "user_id"
WHERE "provider_id" = 'credential'
  AND "account_id" IS DISTINCT FROM "user_id";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "accounts"
    WHERE "account_id" IS NULL OR btrim("account_id") = ''
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      MESSAGE = 'Cannot migrate Better Auth accounts with an unknown account identity',
      DETAIL = 'Every account requires a non-empty account_id after credential account IDs are derived from user_id.';
  END IF;
END $$;

-- Percent-encode every non-encodeURIComponent-safe UTF-8 byte so generic
-- provider IDs map to distinct, stable local OAuth issuers.
UPDATE "accounts"
SET "issuer" = CASE
  WHEN "provider_id" = 'credential' THEN 'local:credential'
  ELSE 'local:oauth:' || (
    SELECT string_agg(
      CASE
        WHEN byte BETWEEN 65 AND 90
          OR byte BETWEEN 97 AND 122
          OR byte BETWEEN 48 AND 57
          OR byte IN (33, 39, 40, 41, 42, 45, 46, 95, 126)
          THEN chr(byte)
        ELSE '%' || upper(lpad(to_hex(byte), 2, '0'))
      END,
      ''
      ORDER BY byte_index
    )
    FROM generate_series(
      0,
      octet_length(convert_to("provider_id", 'UTF8')) - 1
    ) AS provider_bytes(byte_index)
    CROSS JOIN LATERAL (
      SELECT get_byte(convert_to("provider_id", 'UTF8'), byte_index) AS byte
    ) AS encoded_provider
  )
END;

-- Fail before creating the unique index instead of discarding or merging any
-- account rows that resolve to the same Better Auth 1.7 identity.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "accounts"
    GROUP BY "issuer", "account_id"
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23505',
      MESSAGE = 'Cannot migrate Better Auth accounts: issuer/account_id collision',
      DETAIL = 'Multiple account rows resolve to the same Better Auth 1.7 issuer and account ID.';
  END IF;
END $$;

ALTER TABLE "accounts" ALTER COLUMN "issuer" SET NOT NULL;

CREATE UNIQUE INDEX "accounts_issuer_account_id_key"
  ON "accounts"("issuer", "account_id");
