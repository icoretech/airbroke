CREATE OR REPLACE FUNCTION increment_project_notice_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE project
  SET notices_count = notices_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION decrement_project_notice_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE project
  SET notices_count = notices_count - 1
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_notice_create AFTER INSERT ON notice FOR EACH ROW EXECUTE FUNCTION increment_project_notice_count();
CREATE TRIGGER after_notice_delete AFTER DELETE ON notice FOR EACH ROW EXECUTE FUNCTION decrement_project_notice_count();


CREATE OR REPLACE FUNCTION update_hourly_occurrence() RETURNS TRIGGER AS $$
BEGIN
  UPDATE hourly_occurrence AS ho
  SET count = count + 1
  WHERE ho.occurrence_id = NEW.id
    AND ho.interval_start = date_trunc('hour', NEW.updated_at)
    AND ho.interval_end = date_trunc('hour', NEW.updated_at) + interval '1 hour';

  IF NOT FOUND THEN
    INSERT INTO hourly_occurrence (occurrence_id, interval_start, interval_end, count)
    VALUES (NEW.id, date_trunc('hour', NEW.updated_at), date_trunc('hour', NEW.updated_at) + interval '1 hour', 1);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_occurrence AFTER INSERT OR UPDATE ON occurrence FOR EACH ROW EXECUTE FUNCTION update_hourly_occurrence();
