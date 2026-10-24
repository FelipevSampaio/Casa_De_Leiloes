import { auctionRules } from './auctionRules.js';

describe('auctionRules', () => {
  it('accepts a valid first bid', () => {
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

    expect(result.valid).toBe(true);
  });

  it('rejects bids below the minimum increment', () => {
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

    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/maior ou igual/i);
  });

  it('rejects bids when balance is insufficient', () => {
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

    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/saldo insuficiente/i);
  });
});
