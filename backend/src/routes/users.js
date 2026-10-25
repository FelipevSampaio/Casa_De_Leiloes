import express from 'express';

import { walletData } from '../data/mockData.js';

const router = express.Router();

router.get('/:id/balance', (req, res) => {
  res.json(walletData);
});

router.get('/:id/auctions', (req, res) => {
  res.json({
    userId: req.params.id,
    wonAuctions: walletData.wonAuctions,
    activeBids: walletData.activeBids,
  });
});

export default router;
