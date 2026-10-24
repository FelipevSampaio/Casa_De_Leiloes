import express from 'express';

const router = express.Router();

const logs = [
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

router.get('/', (req, res) => {
  res.json({
    message: 'Histórico de auditoria',
    logs,
  });
});

export default router;
