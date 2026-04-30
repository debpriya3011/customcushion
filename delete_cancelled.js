const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.order.deleteMany({
    where: { status: 'CANCELLED' }
  });
  console.log('Deleted cancelled orders:', result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
