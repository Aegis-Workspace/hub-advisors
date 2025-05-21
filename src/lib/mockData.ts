import type { Investment } from '../types';

export const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Flapper',
    type: 'CDB',
    description: 'Plataforma de aviação executiva on-demand com mais de 1000 aeronaves cadastradas. Líder no segmento de fretamento de jatos executivos na América Latina.',
    category: 'AVIACAO_EXECUTIVA',
    minAmount: 5000,
    totalAmount: 4800000,
    availableAmount: 4800000,
    reservedAmount: 0,
    yield: {
      rate: 17.5,
      index: 'CDI'
    },
    term: 24,
    guarantee: 'REAL',
    status: 'OPEN',
    paymentFrequency: 'MONTHLY',
    registeredWith: ['CVM', 'ANBIMA'],
    riskLevel: 'MODERATE',
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1583396618422-6ed248d19e4d?auto=format&fit=crop&q=80&w=100&h=100',
    news: [
      {
        date: '2024-03-20',
        title: 'Expansão de operações',
        content: 'A Flapper anuncia expansão de operações para 3 novos países na América Latina.'
      }
    ],
    documents: [
      {
        name: 'Apresentação Institucional.pdf',
        url: '#'
      },
      {
        name: 'DRE e Balanço.pdf',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    name: 'Minehr',
    type: 'DEBENTURE',
    description: 'Plataforma SaaS de Data Analytics para grandes empresas, com foco em análise preditiva e machine learning.',
    category: 'TECNOLOGIA',
    minAmount: 10000,
    totalAmount: 1200000,
    availableAmount: 1200000,
    reservedAmount: 0,
    yield: {
      rate: 14.2,
      index: 'CDI'
    },
    term: 36,
    guarantee: 'REAL',
    status: 'OPEN',
    paymentFrequency: 'MONTHLY',
    riskLevel: 'MODERATE',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: '3',
    name: 'Mention',
    type: 'DEBENTURE',
    description: 'A primeira startup de Relações Públicas da América Latina. Plataforma SaaS que revoluciona a comunicação corporativa.',
    category: 'SAAS_B2B',
    minAmount: 5000,
    totalAmount: 1360000,
    availableAmount: 1360000,
    reservedAmount: 0,
    yield: {
      rate: 16.8,
      index: 'CDI'
    },
    term: 36,
    guarantee: 'REAL',
    status: 'OPEN',
    paymentFrequency: 'MONTHLY',
    riskLevel: 'MODERATE',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: '4',
    name: 'Brota Company',
    type: 'CDB',
    description: 'Plante o que quiser, onde quiser, sem esforço. Revolucionando a agricultura urbana com tecnologia e sustentabilidade.',
    category: 'AGTECH',
    minAmount: 5000,
    totalAmount: 1500000,
    availableAmount: 1500000,
    reservedAmount: 0,
    yield: {
      rate: 15.5,
      index: 'CDI'
    },
    term: 24,
    guarantee: 'REAL',
    status: 'OPEN',
    paymentFrequency: 'MONTHLY',
    riskLevel: 'LOW',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=100&h=100'
  }
];