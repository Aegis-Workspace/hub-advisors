/*
  # Add more sample investments

  1. New Data
    - Add Mention (SaaS B2B startup)
    - Add Brota Company (AgTech startup)
*/

-- Insert additional sample investments
INSERT INTO investments (
  name,
  description,
  category,
  type,
  logo_url,
  image_url,
  min_amount,
  total_amount,
  available_amount,
  yield_rate,
  yield_index,
  term,
  guarantee,
  payment_frequency,
  risk_level,
  status,
  is_visible,
  is_highlighted,
  commission
) VALUES
(
  'Mention',
  'A primeira startup de Relações Públicas da América Latina. Plataforma SaaS que revoluciona a comunicação corporativa.',
  'SAAS_B2B',
  'DEBENTURE',
  'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
  5000,
  1360000,
  1360000,
  16.8,
  'CDI',
  36,
  'REAL',
  'MONTHLY',
  'MODERATE',
  'OPEN',
  true,
  true,
  '{"upfront":{"rate":3,"payment":"ON_INVESTMENT"},"recurring":{"rate":0.9,"frequency":"MONTHLY"}}'
),
(
  'Brota Company',
  'Plante o que quiser, onde quiser, sem esforço. Revolucionando a agricultura urbana com tecnologia e sustentabilidade.',
  'AGTECH',
  'CDB',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80',
  5000,
  1500000,
  1500000,
  15.5,
  'CDI',
  24,
  'REAL',
  'MONTHLY',
  'LOW',
  'OPEN',
  true,
  false,
  '{"upfront":{"rate":2.8,"payment":"ON_INVESTMENT"},"recurring":{"rate":0.8,"frequency":"MONTHLY"}}'
);