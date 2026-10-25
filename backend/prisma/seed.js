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

  for (const lotConfig of lotSeed) {
    const createdLot = await prisma.lot.upsert({
      where: { id: lotConfig.title },
      update: lotConfig,
      create: {
        ...lotConfig,
        id: `${lotConfig.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      },
    });

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
    data: [
      {
        lotId: 'seed-lot-1',
        action: 'LOT_CREATED',
        details: 'Lote criado pelo vendedor',
        actorId: seller.id,
      },
      {
        lotId: 'seed-lot-2',
        action: 'BID_REGISTERED',
        details: 'João entrou com lance de R$ 1.500.',
        actorId: bidder1.id,
      },
      {
        lotId: 'seed-lot-3',
        action: 'LOT_CLOSED',
        details: 'Relógio de parede foi arrematado por Maria.',
        actorId: bidder2.id,
      },
    ],
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
