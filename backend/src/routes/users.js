import express from 'express';

const router = express.Router();

const wallet = {
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

router.get('/:id/balance', (req, res) => {
  res.json(wallet);
});

router.get('/:id/auctions', (req, res) => {
  res.json({
    userId: req.params.id,
    wonAuctions: wallet.wonAuctions,
    activeBids: wallet.activeBids,
  });
});

export default router;
