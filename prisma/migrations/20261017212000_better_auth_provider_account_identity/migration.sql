-- Better Auth 1.7.3+ identifies accounts by provider_id/account_id and no
-- longer writes issuer. Retain legacy issuer values as optional metadata.
BEGIN;

-- Never merge accounts across issuers automatically. Operators must assign
-- distinct provider IDs if legacy identities collide under the current key.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "accounts"
    GROUP BY "provider_id", "account_id"
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23505',
      MESSAGE = 'Cannot migrate Better Auth accounts: provider_id/account_id collision',
      DETAIL = 'Resolve duplicate provider identities without merging different users before retrying.';
  END IF;
END $$;

CREATE UNIQUE INDEX "accounts_provider_id_account_id_key"
  ON "accounts"("provider_id", "account_id");

ALTER TABLE "accounts" ALTER COLUMN "issuer" DROP NOT NULL;
DROP INDEX "accounts_issuer_account_id_key";

COMMIT;
