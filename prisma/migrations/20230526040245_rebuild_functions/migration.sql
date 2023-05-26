-- Drop triggers
DROP TRIGGER IF EXISTS after_notice_create ON notice;
DROP TRIGGER IF EXISTS after_notice_delete ON notice;
DROP TRIGGER IF EXISTS after_occurrence ON occurrence;

-- Drop functions
DROP FUNCTION IF EXISTS increment_project_notice_count();
DROP FUNCTION IF EXISTS decrement_project_notice_count();
DROP FUNCTION IF EXISTS update_hourly_occurrence();

CREATE OR REPLACE FUNCTION increment_project_notices_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET notices_count = notices_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION decrement_project_notices_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET notices_count = notices_count - 1
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_notice_create AFTER INSERT ON notices FOR EACH ROW EXECUTE FUNCTION increment_project_notices_count();
CREATE TRIGGER after_notice_delete AFTER DELETE ON notices FOR EACH ROW EXECUTE FUNCTION decrement_project_notices_count();

CREATE OR REPLACE FUNCTION update_hourly_occurrences() RETURNS TRIGGER AS $$
BEGIN
  UPDATE hourly_occurrences AS ho
  SET count = count + 1
  WHERE ho.occurrence_id = NEW.id
    AND ho.interval_start = date_trunc('hour', NEW.updated_at)
    AND ho.interval_end = date_trunc('hour', NEW.updated_at) + interval '1 hour';

  IF NOT FOUND THEN
    INSERT INTO hourly_occurrences (occurrence_id, interval_start, interval_end, count)
    VALUES (NEW.id, date_trunc('hour', NEW.updated_at), date_trunc('hour', NEW.updated_at) + interval '1 hour', 1);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_occurrence AFTER INSERT OR UPDATE ON occurrences FOR EACH ROW EXECUTE FUNCTION update_hourly_occurrences();
