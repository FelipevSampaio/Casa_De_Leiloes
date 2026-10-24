import express from 'express';

const router = express.Router();

const sampleLots = [
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

router.get('/', (req, res) => {
  res.json({
    message: 'Listar lotes ativos',
    lots: sampleLots,
  });
});

router.get('/:id', (req, res) => {
  const lot = sampleLots.find((item) => item.id === req.params.id) || sampleLots[0];

  res.json({
    message: 'Detalhes do lote',
    lot,
  });
});

router.post('/', (req, res) => {
  const payload = req.body;
  const newLot = {
    id: `lot-${Date.now()}`,
    ...payload,
    currentBid: payload.initialPrice,
    status: 'ACTIVE',
  };

  sampleLots.unshift(newLot);

  res.status(201).json({
    message: 'Criar lote',
    lot: newLot,
  });
});

router.post('/:id/bids', (req, res) => {
  const { amount } = req.body;
  const lot = sampleLots.find((item) => item.id === req.params.id) || sampleLots[0];

  if (lot) {
    lot.currentBid = Number(amount);
  }

  res.status(201).json({
    message: 'Registrar lance',
    data: {
      lotId: req.params.id,
      amount,
      status: 'accepted',
    },
  });
});

router.post('/:id/close', (req, res) => {
  const lot = sampleLots.find((item) => item.id === req.params.id) || sampleLots[0];

  if (lot) {
    lot.status = 'CLOSED';
  }

  res.json({
    message: 'Encerrar lote',
    lotId: req.params.id,
    status: 'CLOSED',
  });
});

export default router;
