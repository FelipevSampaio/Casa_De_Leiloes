import express from 'express';

const router = express.Router();

router.get('/:id/balance', (req, res) => {
  res.json({
    userId: req.params.id,
    totalBalance: 5000,
    availableBalance: 4200,
    committedBalance: 800
  });
});

router.get('/:id/auctions', (req, res) => {
  res.json({
    userId: req.params.id,
    wonAuctions: [],
    activeBids: []
  });
});

export default router;
