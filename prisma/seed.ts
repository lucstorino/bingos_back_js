import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (in reverse order of dependencies)
  await prisma.winner.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cardNumber.deleteMany();
  await prisma.bingoCard.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.bingo.deleteMany();

  console.log('✓ Cleaned existing data');

  // Create Bingo
  const bingo = await prisma.bingo.create({
    data: {
      name: 'Bingo Navidad 2026',
      description: 'Bingo especial de Navidad con premios increíbles',
      drawDate: new Date('2026-12-25'),
      price: 10000,
      status: 'ACTIVE',
    },
  });

  console.log(`✓ Created Bingo: ${bingo.name}`);

  // Create 100 Bingo Cards with 10 numbers each
  const cardPromises = [];
  for (let i = 1; i <= 100; i++) {
    const cardNumber = `14600${String(i).padStart(3, '0')}`;
    cardPromises.push(
      prisma.bingoCard.create({
        data: {
          bingoId: bingo.id,
          cardNumber: cardNumber,
          status: 'AVAILABLE',
          cardNumbers: {
            create: generateRandomNumbers(10),
          },
        },
      }),
    );
  }

  const cards = await Promise.all(cardPromises);
  console.log(`✓ Created ${cards.length} Bingo Cards`);

  // Create Prizes
  const prizes = await prisma.prize.createMany({
    data: [
      {
        bingoId: bingo.id,
        name: '1° Premio',
        description: '$5.000.000',
        amount: 5000000,
        position: 1,
      },
      {
        bingoId: bingo.id,
        name: '2° Premio',
        description: '$1.500.000',
        amount: 1500000,
        position: 2,
      },
      {
        bingoId: bingo.id,
        name: '3° Premio',
        description: '$750.000',
        amount: 750000,
        position: 3,
      },
      {
        bingoId: bingo.id,
        name: '4° Premio',
        description: '$250.000',
        amount: 250000,
        position: 4,
      },
      {
        bingoId: bingo.id,
        name: '5° Premio',
        description: '$100.000',
        amount: 100000,
        position: 5,
      },
    ],
  });

  console.log(`✓ Created ${prizes.count} Prizes`);

  // Create Customers
  const customers = await prisma.customer.createMany({
    data: [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        dni: '12345678',
        address: 'Calle Principal 123',
        phone: '1234567890',
        email: 'juan@example.com',
      },
      {
        firstName: 'María',
        lastName: 'González',
        dni: '87654321',
        address: 'Avenida Central 456',
        phone: '0987654321',
        email: 'maria@example.com',
      },
      {
        firstName: 'Carlos',
        lastName: 'López',
        dni: '11111111',
        address: 'Calle Secundaria 789',
        phone: '5555555555',
        email: 'carlos@example.com',
      },
    ],
  });

  console.log(`✓ Created ${customers.count} Customers`);

  // Create test Orders and Payments
  const testCustomers = await prisma.customer.findMany({ take: 2 });
  const testCards = cards.slice(0, 2);

  for (let i = 0; i < 2; i++) {
    const order = await prisma.order.create({
      data: {
        customerId: testCustomers[i].id,
        bingoId: bingo.id,
        cardId: testCards[i].id,
        amount: bingo.price,
        status: 'PENDING',
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'MERCADO_PAGO',
        amount: bingo.price,
        status: 'PENDING',
      },
    });

    console.log(`✓ Created Order and Payment for ${testCustomers[i].firstName}`);
  }

  console.log('✅ Seed completed successfully!');
}

function generateRandomNumbers(count: number) {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * 90) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).map((number) => ({
    number,
  }));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
