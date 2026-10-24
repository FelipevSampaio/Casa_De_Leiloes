import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Listar lotes ativos',
    lots: []
  });
});

router.get('/:id', (req, res) => {
  res.json({
    message: 'Detalhes do lote',
    lot: {
      id: req.params.id,
      title: 'Exemplo de lote',
      status: 'ACTIVE',
      currentBid: 150,
      initialPrice: 100,
      minimumIncrement: 10
    }
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Criar lote',
    body: req.body
  });
});

router.post('/:id/bids', (req, res) => {
  const { amount } = req.body;

  res.status(201).json({
    message: 'Registrar lance',
    data: {
      lotId: req.params.id,
      amount,
      status: 'accepted'
    }
  });
});

router.post('/:id/close', (req, res) => {
  res.json({
    message: 'Encerrar lote',
    lotId: req.params.id,
    status: 'CLOSED'
  });
});

export default router;
