/*
  # Add auto close date to investments

  1. Changes
    - Add `auto_close_date` column to `investments` table to support automatic closing of investments
*/

ALTER TABLE investments
ADD COLUMN IF NOT EXISTS auto_close_date timestamptz;