ALTER TABLE complaints
  ADD COLUMN IF NOT EXISTS ai_department text,
  ADD COLUMN IF NOT EXISTS ai_confidence real,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS ai_model text,
  ADD COLUMN IF NOT EXISTS ai_source text,
  ADD COLUMN IF NOT EXISTS ai_duplicate_of uuid,
  ADD COLUMN IF NOT EXISTS ai_duplicate_score real;
