import { requestFarmerRole, requestPartnerRole, requestInvestorRole } from '../src/app/actions';
import { db } from '../src/lib/db';

async function main() {
  console.log('--- TESTING APPLICATIONS CENTER ACTIONS ---');
  
  // Create a clean test user
  const email = 'test_app_user@prithvora.com';
  console.log(`Creating test user with email: ${email}`);
  
  // Delete existing test user if any
  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      await db.farmer.deleteMany({ where: { userId: existing.id } });
      await db.partner.deleteMany({ where: { userId: existing.id } });
      await db.investorLead.deleteMany({ where: { userId: existing.id } });
      await db.user.delete({ where: { id: existing.id } });
    }
  } catch (err) {
    console.log('Clean up test user error (safe to ignore if first run):', err);
  }

  const user = await db.user.create({
    data: {
      email,
      name: 'Test App User',
      password: 'password123',
      role: 'USER',
    }
  });
  console.log(`Test user created with ID: ${user.id}`);

  // 1. Test requestFarmerRole
  console.log('\nTesting requestFarmerRole...');
  const farmerRes = await requestFarmerRole(email, {
    fullName: 'Test Farmer Name',
    phone: '9999999999',
    state: 'Rajasthan',
    district: 'Alwar',
    farmSizeAcres: 5.0,
    primaryCrops: 'Honey',
    procurementModel: 'Contract Farming'
  });
  console.log('Farmer application result:', farmerRes);

  // 2. Test requestPartnerRole
  console.log('\nTesting requestPartnerRole...');
  const partnerRes = await requestPartnerRole(email, {
    fullName: 'Test Partner Name',
    email: 'test_partner@mail.com',
    phone: '8888888888',
    companyName: 'Test Partner Co',
    tier: 'SILVER',
    experienceYears: 5,
    investmentBudget: 1000000
  });
  console.log('Partner application result:', partnerRes);

  // 3. Test requestInvestorRole
  console.log('\nTesting requestInvestorRole...');
  const investorRes = await requestInvestorRole(email, {
    fullName: 'Test Investor Name',
    email: 'test_investor@mail.com',
    phone: '7777777777',
    investmentRange: '$10k-$50k',
    accreditedStatus: true,
    message: 'Hello'
  });
  console.log('Investor application result:', investorRes);

  // Clean up
  console.log('\nCleaning up test user...');
  await db.farmer.deleteMany({ where: { userId: user.id } });
  await db.partner.deleteMany({ where: { userId: user.id } });
  await db.investorLead.deleteMany({ where: { userId: user.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log('Cleanup completed successfully!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
