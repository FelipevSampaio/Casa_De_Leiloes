import express from 'express';

import { prisma } from '../lib/prisma.js';
import { sampleLots } from '../data/mockData.js';

const router = express.Router();

const getLotsFromSource = async () => {
  if (!process.env.DATABASE_URL) {
    return sampleLots;
  }

  try {
    const lots = await prisma.lot.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return lots.map((lot) => ({
      ...lot,
      currentBid: lot.currentBid ?? lot.initialPrice,
      status: lot.status,
    }));
  } catch (error) {
    console.warn('Falling back to mock data because PostgreSQL is unavailable:', error.message);
    return sampleLots;
  }
};

router.get('/', async (req, res) => {
  const lots = await getLotsFromSource();
  res.json({
    message: 'Listar lotes ativos',
    lots,
  });
});

router.get('/:id', async (req, res) => {
  const lots = await getLotsFromSource();
  const lot = lots.find((item) => item.id === req.params.id) || lots[0];

  res.json({
    message: 'Detalhes do lote',
    lot,
  });
});

router.post('/', async (req, res) => {
  const payload = req.body;
  const newLot = {
    id: `lot-${Date.now()}`,
    ...payload,
    currentBid: payload.initialPrice,
    status: 'ACTIVE',
  };

  if (process.env.DATABASE_URL) {
    try {
      const created = await prisma.lot.create({
        data: {
          title: payload.title,
          description: payload.description || 'Lote criado pela plataforma.',
          initialPrice: payload.initialPrice,
          minimumIncrement: payload.minimumIncrement,
          currentBid: payload.initialPrice,
          status: 'ACTIVE',
          endsAt: payload.endsAt ? new Date(payload.endsAt) : new Date(Date.now() + 3 * 60 * 60 * 1000),
          createdById: 'mock-seller',
        },
      });

      return res.status(201).json({ message: 'Criar lote', lot: { ...created, currentBid: created.currentBid ?? created.initialPrice } });
    } catch (error) {
      console.warn('Prisma insert failed, using mock data fallback:', error.message);
    }
  }

  sampleLots.unshift(newLot);

  return res.status(201).json({
    message: 'Criar lote',
    lot: newLot,
  });
});

router.post('/:id/bids', async (req, res) => {
  const { amount } = req.body;
  const lots = await getLotsFromSource();
  const lot = lots.find((item) => item.id === req.params.id) || lots[0];

  if (lot) {
    lot.currentBid = Number(amount);
  }

  if (process.env.DATABASE_URL) {
    try {
      await prisma.bid.create({
        data: {
          lotId: req.params.id,
          bidderId: 'mock-bidder',
          amount: Number(amount),
        },
      });
    } catch (error) {
      console.warn('Bid save to Prisma failed:', error.message);
    }
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

router.post('/:id/close', async (req, res) => {
  const lots = await getLotsFromSource();
  const lot = lots.find((item) => item.id === req.params.id) || lots[0];

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
