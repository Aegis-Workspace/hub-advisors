/*
  # Add commission column to investments table

  1. Changes
    - Add commission column to store advisor commission settings
    - Add column comment to document the structure
*/

-- Add commission column
ALTER TABLE investments
ADD COLUMN IF NOT EXISTS commission jsonb;

-- Add column comment
COMMENT ON COLUMN investments.commission IS 'JSON object containing advisor commission settings: { upfront: { rate: number, payment: string }, recurring: { rate: number, frequency: string } }';