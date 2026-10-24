import test from 'node:test';
import assert from 'node:assert/strict';

import { auctionRules } from './auctionRules.js';

test('accepts a valid first bid', () => {
  const result = auctionRules.validateBid({
    lot: {
      status: 'ACTIVE',
      initialPrice: 100,
      minimumIncrement: 10,
    },
    bidAmount: 110,
    currentBid: null,
    bidderBalance: 500,
  });

  assert.equal(result.valid, true);
});

test('rejects bids below the minimum increment', () => {
  const result = auctionRules.validateBid({
    lot: {
      status: 'ACTIVE',
      initialPrice: 100,
      minimumIncrement: 10,
    },
    bidAmount: 105,
    currentBid: 100,
    bidderBalance: 500,
  });

  assert.equal(result.valid, false);
  assert.match(result.reason, /maior ou igual/i);
});

test('rejects bids when balance is insufficient', () => {
  const result = auctionRules.validateBid({
    lot: {
      status: 'ACTIVE',
      initialPrice: 100,
      minimumIncrement: 10,
    },
    bidAmount: 200,
    currentBid: 100,
    bidderBalance: 150,
  });

  assert.equal(result.valid, false);
  assert.match(result.reason, /saldo insuficiente/i);
});
