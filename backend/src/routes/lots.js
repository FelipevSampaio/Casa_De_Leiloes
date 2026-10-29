import express from 'express';

import { auctionRules } from '../domain/auctionRules.js';
import { prisma } from '../lib/prisma.js';
import { sampleLots } from '../data/mockData.js';

const router = express.Router();

const ensureDefaultSeller = async () => {
  if (!process.env.DATABASE_URL) return 'mock-seller';

  const seller = await prisma.user.upsert({
    where: { email: 'vendedor@leiloes.com' },
    update: {},
    create: {
      name: 'Leiloeiro Oficial',
      email: 'vendedor@leiloes.com',
      role: 'SELLER',
      balance: 10000,
    },
  });

  return seller.id;
};

const ensureDefaultBidder = async () => {
  if (!process.env.DATABASE_URL) return 'mock-bidder';

  const bidder = await prisma.user.upsert({
    where: { email: 'comprador@leiloes.com' },
    update: {},
    create: {
      name: 'Comprador Oficial',
      email: 'comprador@leiloes.com',
      role: 'BIDDER',
      balance: 10000,
    },
  });

  return bidder.id;
};

const getLotsFromSource = async () => {
  if (!process.env.DATABASE_URL) {
    return sampleLots;
  }

  try {
    const lots = await prisma.lot.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return lots
      .map((lot) => ({
        ...lot,
        currentBid: lot.currentBid ?? lot.initialPrice,
        status: lot.status,
      }))
      .sort((a, b) => {
        if (a.status === b.status) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return a.status === 'ACTIVE' ? -1 : 1;
      });
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
      const sellerId = await ensureDefaultSeller();
      const created = await prisma.lot.create({
        data: {
          title: payload.title,
          description: payload.description || 'Lote criado pela plataforma.',
          initialPrice: Number(payload.initialPrice),
          minimumIncrement: Number(payload.minimumIncrement ?? 0),
          currentBid: Number(payload.initialPrice),
          status: 'ACTIVE',
          endsAt: payload.endsAt ? new Date(payload.endsAt) : new Date(Date.now() + 3 * 60 * 60 * 1000),
          createdById: sellerId,
        },
      });

      await prisma.auditLog.create({
        data: {
          lotId: created.id,
          actorId: sellerId,
          action: 'LOT_CREATED',
          details: `Lote "${created.title}" publicado pelo leiloeiro.`,
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
  const bidAmount = Number(amount);
  const lots = await getLotsFromSource();
  const lot = lots.find((item) => item.id === req.params.id) || lots[0];

  if (!lot) {
    return res.status(404).json({ message: 'Lote não encontrado.' });
  }

  if (process.env.DATABASE_URL) {
    try {
      const dbLot = await prisma.lot.findUnique({
        where: { id: req.params.id },
      });

      if (!dbLot) {
        return res.status(404).json({ message: 'Lote não encontrado no banco.' });
      }

      const bidderId = await ensureDefaultBidder();
      const bidder = await prisma.user.findUnique({ where: { id: bidderId } });
      const validation = auctionRules.validateBid({
        lot: {
          status: dbLot.status,
          initialPrice: dbLot.initialPrice,
          minimumIncrement: dbLot.minimumIncrement,
        },
        bidAmount,
        currentBid: dbLot.currentBid,
        bidderBalance: bidder?.balance ?? 0,
      });

      if (!validation.valid) {
        return res.status(400).json({
          message: 'Lance rejeitado.',
          reason: validation.reason,
        });
      }

      const createdBid = await prisma.bid.create({
        data: {
          lotId: req.params.id,
          bidderId,
          amount: bidAmount,
        },
      });

      await prisma.lot.update({
        where: { id: req.params.id },
        data: {
          currentBid: bidAmount,
          winnerId: bidderId,
        },
      });

      await prisma.auditLog.create({
        data: {
          lotId: req.params.id,
          actorId: bidderId,
          action: 'BID_REGISTERED',
          details: `Lance de R$ ${bidAmount.toFixed(2)} registrado.`,
        },
      });

      return res.status(201).json({
        message: 'Registrar lance',
        data: {
          lotId: req.params.id,
          amount: createdBid.amount,
          status: 'accepted',
        },
      });
    } catch (error) {
      console.warn('Bid save to Prisma failed:', error.message);
      return res.status(400).json({ message: 'Erro ao registrar lance.', reason: error.message });
    }
  }

  const validation = auctionRules.validateBid({
    lot,
    bidAmount,
    currentBid: lot.currentBid,
    bidderBalance: 10000,
  });

  if (!validation.valid) {
    return res.status(400).json({
      message: 'Lance rejeitado.',
      reason: validation.reason,
    });
  }

  lot.currentBid = Number(amount);

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

  if (!lot) {
    return res.status(404).json({ message: 'Lote não encontrado.' });
  }

  if (process.env.DATABASE_URL) {
    try {
      const lotRecord = await prisma.lot.findUnique({
        where: { id: req.params.id },
        include: {
          bids: {
            orderBy: { amount: 'desc' },
            take: 1,
          },
        },
      });

      const winnerId = lotRecord?.bids?.[0]?.bidderId ?? null;
      const sellerId = await ensureDefaultSeller();
      const updated = await prisma.lot.update({
        where: { id: req.params.id },
        data: {
          status: 'CLOSED',
          winnerId,
          currentBid: lotRecord?.bids?.[0]?.amount ?? lotRecord?.currentBid ?? lot.currentBid,
        },
      });

      await prisma.auditLog.create({
        data: {
          lotId: req.params.id,
          actorId: sellerId,
          action: 'LOT_CLOSED',
          details: winnerId
            ? `Lote encerrado com vencedor ${winnerId}.`
            : `Lote encerrado sem lance vencedor.`,
        },
      });

      return res.json({
        message: 'Encerrar lote',
        lotId: req.params.id,
        status: updated.status,
        winnerId,
      });
    } catch (error) {
      console.warn('Lot closure failed in Prisma:', error.message);
      return res.status(400).json({ message: 'Erro ao encerrar lote.', reason: error.message });
    }
  }

  lot.status = 'CLOSED';

  res.json({
    message: 'Encerrar lote',
    lotId: req.params.id,
    status: 'CLOSED',
  });
});

export default router;
