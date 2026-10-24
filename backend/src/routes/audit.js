import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Histórico de auditoria',
    logs: [
      {
        id: 'log-1',
        action: 'LOT_CREATED',
        details: 'Lote criado pelo vendedor',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

export default router;
