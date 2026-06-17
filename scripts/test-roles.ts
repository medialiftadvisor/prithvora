import { getUserDashboardRoles } from '../src/app/actions';
import { db } from '../src/lib/db';

async function main() {
  console.log('--- TESTING getUserDashboardRoles ---');
  
  const emails = ['farmer@prithvora.com', 'partner@prithvora.com', 'investor@prithvora.com'];
  for (const email of emails) {
    console.log(`\nEmail: ${email}`);
    const res = await getUserDashboardRoles(email);
    console.log('Result:', JSON.stringify(res, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
