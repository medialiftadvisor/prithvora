import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- DIAGNOSTICS START ---');
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      farmer: {
        select: {
          id: true,
          fullName: true,
          status: true,
        }
      },
      partner: {
        select: {
          id: true,
          fullName: true,
          status: true,
        }
      },
      investorLead: {
        select: {
          id: true,
          fullName: true,
          status: true,
        }
      }
    }
  });
  console.log('USERS:', JSON.stringify(users, null, 2));

  const farmers = await prisma.farmer.findMany({
    select: { id: true, fullName: true, status: true, userId: true }
  });
  console.log('FARMERS:', JSON.stringify(farmers, null, 2));

  const partners = await prisma.partner.findMany({
    select: { id: true, fullName: true, status: true, userId: true }
  });
  console.log('PARTNERS:', JSON.stringify(partners, null, 2));

  const investors = await prisma.investorLead.findMany({
    select: { id: true, fullName: true, status: true, userId: true }
  });
  console.log('INVESTORS:', JSON.stringify(investors, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
