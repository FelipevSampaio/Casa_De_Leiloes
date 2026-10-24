import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import lotsRoutes from './routes/lots.js';
import usersRoutes from './routes/users.js';
import auditRoutes from './routes/audit.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Casa de leilões backend online' });
});

app.use('/lots', lotsRoutes);
app.use('/users', usersRoutes);
app.use('/audit', auditRoutes);

export default app;
