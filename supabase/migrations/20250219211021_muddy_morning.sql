/*
  # Fix investment column names

  1. Changes
    - Rename `auto_close_date` to `autoCloseDate` to match the application code
    - Add comments to document the column usage
*/

-- Rename the column to match application code
ALTER TABLE investments 
RENAME COLUMN auto_close_date TO "autoCloseDate";

-- Add column comment
COMMENT ON COLUMN investments."autoCloseDate" IS 'Date when the investment should be automatically closed';