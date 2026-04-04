-- AlterTable
ALTER TABLE "notices" ADD COLUMN "resolved_at" TIMESTAMP(6);

-- CreateIndex
CREATE INDEX "notices_resolved_at_idx" ON "notices"("resolved_at");

-- Create trigger function to sync notice resolved_at from occurrences
CREATE OR REPLACE FUNCTION sync_notice_resolved_at() RETURNS trigger AS $$
DECLARE
  target_notice_id TEXT;
  unresolved_count BIGINT;
BEGIN
  -- Determine the affected notice_id
  IF TG_OP = 'DELETE' THEN
    target_notice_id := OLD.notice_id;
  ELSE
    target_notice_id := NEW.notice_id;
  END IF;

  -- Count unresolved occurrences for this notice
  SELECT COUNT(*) INTO unresolved_count
  FROM occurrences
  WHERE notice_id = target_notice_id
    AND resolved_at IS NULL;

  IF unresolved_count = 0 THEN
    -- All resolved (or no occurrences): mark notice resolved
    UPDATE notices
    SET resolved_at = NOW()
    WHERE id = target_notice_id
      AND resolved_at IS NULL;
  ELSE
    -- At least one unresolved: clear notice resolved
    UPDATE notices
    SET resolved_at = NULL
    WHERE id = target_notice_id
      AND resolved_at IS NOT NULL;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to occurrences table
CREATE TRIGGER trg_sync_notice_resolved_at
  AFTER INSERT OR UPDATE OF resolved_at OR DELETE
  ON occurrences
  FOR EACH ROW
  EXECUTE FUNCTION sync_notice_resolved_at();

-- Backfill: set resolved_at for notices where all occurrences are already resolved
UPDATE notices SET resolved_at = NOW()
WHERE id IN (
  SELECT n.id FROM notices n
  WHERE EXISTS (SELECT 1 FROM occurrences o WHERE o.notice_id = n.id)
  AND NOT EXISTS (
    SELECT 1 FROM occurrences o
    WHERE o.notice_id = n.id AND o.resolved_at IS NULL
  )
);
