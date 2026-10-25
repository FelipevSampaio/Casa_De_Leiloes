import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lots = [
    {
      title: 'Mesa de jantar vintage',
      description: 'Peça artesanal com acabamento em madeira maciça.',
      initialPrice: 1200,
      minimumIncrement: 50,
      currentBid: 1500,
      status: 'ACTIVE',
      endsAt: new Date('2026-10-24T12:00:00.000Z'),
    },
    {
      title: 'Relógio antigo de parede',
      description: 'Relógio com mecanismo mecânico e caixa em latão.',
      initialPrice: 700,
      minimumIncrement: 20,
      currentBid: 980,
      status: 'ACTIVE',
      endsAt: new Date('2026-10-24T14:00:00.000Z'),
    },
  ];

  await prisma.lot.createMany({
    data: lots,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
