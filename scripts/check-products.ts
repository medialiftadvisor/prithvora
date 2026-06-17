import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- PRODUCTS LINKED TO FARMERS ---');
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      farmerId: true,
      farmer: {
        select: {
          fullName: true
        }
      }
    }
  });
  console.log('PRODUCTS:', JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
