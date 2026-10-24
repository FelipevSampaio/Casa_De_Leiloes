export const auctionRules = {
  validateBid({ lot, bidAmount, currentBid, bidderBalance }) {
    if (!lot || lot.status !== 'ACTIVE') {
      return { valid: false, reason: 'Lote não está ativo.' };
    }

    const minimumAllowed = currentBid == null
      ? Number(lot.initialPrice)
      : Number(currentBid) + Number(lot.minimumIncrement);

    if (Number(bidAmount) < minimumAllowed) {
      return {
        valid: false,
        reason: `O lance deve ser maior ou igual a ${minimumAllowed.toFixed(2)}`,
      };
    }

    if (Number(bidderBalance) < Number(bidAmount)) {
      return { valid: false, reason: 'Saldo insuficiente para esse lance.' };
    }

    return { valid: true };
  },

  getAvailableBalance(totalBalance, committedBalance) {
    return Number(totalBalance) - Number(committedBalance);
  },

  isAuctionClosed(lot) {
    if (!lot) return true;
    return lot.status !== 'ACTIVE';
  },
};
