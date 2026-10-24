import test from 'node:test';
import assert from 'node:assert/strict';

import app from './app.js';

test('GET /health returns application status', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.status, 'ok');
    assert.equal(payload.message, 'Casa de leilões backend online');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('GET /lots returns auction list', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/lots`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(payload.lots));
    assert.ok(payload.lots.length >= 1);
    assert.equal(payload.lots[0].status, 'ACTIVE');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('GET /users/:id/balance returns balance summary', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/users/user-1/balance`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.userId, 'user-1');
    assert.equal(payload.totalBalance, 5000);
    assert.equal(payload.availableBalance, 4200);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('GET /audit returns logs', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/audit`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(payload.logs));
    assert.ok(payload.logs.length >= 1);
    assert.match(payload.logs[0].action, /LOT|BID/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
