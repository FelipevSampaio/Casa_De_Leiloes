export const sampleLots = [
  {
    id: 'lot-1',
    title: 'Mesa de jantar vintage',
    description: 'Peça artesanal com acabamento em madeira maciça.',
    initialPrice: 1200,
    minimumIncrement: 50,
    currentBid: 1500,
    status: 'ACTIVE',
    seller: 'Leiloeiro oficial',
    endsAt: '2026-10-24T12:00:00.000Z',
  },
  {
    id: 'lot-2',
    title: 'Relógio antigo de parede',
    description: 'Relógio com mecanismo mecânico e caixa em latão.',
    initialPrice: 700,
    minimumIncrement: 20,
    currentBid: 980,
    status: 'ACTIVE',
    seller: 'Antiga coleção',
    endsAt: '2026-10-24T14:00:00.000Z',
  },
  {
    id: 'lot-3',
    title: 'Console retrô',
    description: 'Console clássico com acessórios originais.',
    initialPrice: 1800,
    minimumIncrement: 100,
    currentBid: 2100,
    status: 'CLOSED',
    seller: 'Coleção retrô',
    endsAt: '2026-10-23T18:00:00.000Z',
  },
];

export const walletData = {
  userId: 'user-1',
  totalBalance: 5000,
  availableBalance: 4200,
  committedBalance: 800,
  wonAuctions: [
    { id: 'lot-3', title: 'Console retrô', amount: 2100 },
  ],
  activeBids: [
    { id: 'lot-1', title: 'Mesa de jantar vintage', amount: 1500 },
    { id: 'lot-2', title: 'Relógio antigo de parede', amount: 980 },
  ],
};

export const auditLogs = [
  {
    id: 'log-1',
    action: 'LOT_CREATED',
    details: 'Lote criado pelo vendedor',
    createdAt: '2026-10-24T10:10:00.000Z',
  },
  {
    id: 'log-2',
    action: 'BID_REGISTERED',
    details: 'João entrou com lance de R$ 1.500.',
    createdAt: '2026-10-24T10:15:00.000Z',
  },
  {
    id: 'log-3',
    action: 'LOT_CLOSED',
    details: 'Relógio de parede foi arrematado por Maria.',
    createdAt: '2026-10-24T10:31:00.000Z',
  },
];
