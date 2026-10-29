import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const seller = await prisma.user.upsert({
    where: { email: 'vendedor@leiloes.com' },
    update: {},
    create: {
      name: 'Leiloeiro Oficial',
      email: 'vendedor@leiloes.com',
      role: 'SELLER',
      balance: 5000,
    },
  });

  const bidder1 = await prisma.user.upsert({
    where: { email: 'joao@leiloes.com' },
    update: {},
    create: {
      name: 'João',
      email: 'joao@leiloes.com',
      role: 'BIDDER',
      balance: 4500,
    },
  });

  const bidder2 = await prisma.user.upsert({
    where: { email: 'maria@leiloes.com' },
    update: {},
    create: {
      name: 'Maria',
      email: 'maria@leiloes.com',
      role: 'BIDDER',
      balance: 5200,
    },
  });

  const lotSeed = [
    {
      title: 'Mesa de jantar vintage',
      description: 'Peça artesanal com acabamento em madeira maciça.',
      initialPrice: 1200,
      minimumIncrement: 50,
      currentBid: 1500,
      status: 'ACTIVE',
      endsAt: new Date('2026-10-26T12:00:00.000Z'),
      createdById: seller.id,
    },
    {
      title: 'Relógio antigo de parede',
      description: 'Relógio com mecanismo mecânico e caixa em latão.',
      initialPrice: 700,
      minimumIncrement: 20,
      currentBid: 980,
      status: 'ACTIVE',
      endsAt: new Date('2026-10-27T14:00:00.000Z'),
      createdById: seller.id,
    },
    {
      title: 'Console retrô',
      description: 'Console clássico com acessórios originais.',
      initialPrice: 1800,
      minimumIncrement: 100,
      currentBid: 2100,
      status: 'CLOSED',
      endsAt: new Date('2026-10-20T18:00:00.000Z'),
      createdById: seller.id,
      winnerId: bidder1.id,
    },
  ];

  const createdLots = [];

  for (const lotConfig of lotSeed) {
    const existingLot = await prisma.lot.findFirst({
      where: { title: lotConfig.title },
    });

    let createdLot;

    if (existingLot) {
      createdLot = await prisma.lot.update({
        where: { id: existingLot.id },
        data: {
          ...lotConfig,
          currentBid: lotConfig.currentBid ?? null,
          winnerId: lotConfig.winnerId ?? null,
        },
      });
    } else {
      createdLot = await prisma.lot.create({
        data: {
          ...lotConfig,
          currentBid: lotConfig.currentBid ?? null,
          winnerId: lotConfig.winnerId ?? null,
        },
      });
    }

    createdLots.push(createdLot);

    await prisma.bid.createMany({
      data: [
        {
          lotId: createdLot.id,
          bidderId: bidder1.id,
          amount: createdLot.currentBid ?? createdLot.initialPrice,
        },
      ],
      skipDuplicates: true,
    });
  }

  await prisma.auditLog.createMany({
    data: createdLots.map((lot, index) => ({
      lotId: lot.id,
      action: index === 0 ? 'LOT_CREATED' : index === 1 ? 'BID_REGISTERED' : 'LOT_CLOSED',
      details:
        index === 0
          ? 'Lote criado pelo vendedor'
          : index === 1
            ? 'João entrou com lance de R$ 1.500.'
            : 'Relógio de parede foi arrematado por Maria.',
      actorId: index === 0 ? seller.id : index === 1 ? bidder1.id : bidder2.id,
    })),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    console.log('Seed concluído com sucesso.');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Erro ao popular seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
