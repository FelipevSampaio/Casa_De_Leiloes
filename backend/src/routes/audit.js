import express from 'express';

import { prisma } from '../lib/prisma.js';
import { auditLogs } from '../data/mockData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.json({
      message: 'Histórico de auditoria',
      logs: auditLogs,
    });
  }

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      message: 'Histórico de auditoria',
      logs,
    });
  } catch (error) {
    console.warn('Falling back to mock audit logs:', error.message);
    return res.json({
      message: 'Histórico de auditoria',
      logs: auditLogs,
    });
  }
});

export default router;
