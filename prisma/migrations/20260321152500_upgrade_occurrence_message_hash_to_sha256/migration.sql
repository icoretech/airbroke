CREATE EXTENSION IF NOT EXISTS "pgcrypto";

UPDATE "occurrences"
SET "message_hash" = encode(digest("message"::text, 'sha256'), 'hex');
