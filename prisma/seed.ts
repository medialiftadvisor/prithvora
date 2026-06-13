import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: 'Raw Wildflower Honey',
    slug: 'raw-wildflower-honey',
    category: 'Honey',
    price: 450,
    image: '/honey.png',
    description: '100% pure, unpasteurized honey collected directly from wildflower meadows in Himachal Pradesh. Extracted cold to preserve enzymes and active bioflavonoids.',
    benefits: 'Boosts energy naturally, acts as a natural cough suppressant, rich in healing enzymes and antioxidants.',
    nutrition: 'Energy: 304 kcal, Carbohydrates: 82g, Natural Sugars: 80g, Sodium: 4mg (per 100g)',
    rating: 4.9,
    stock: 120,
    isOrganic: true
  },
  {
    name: 'A2 Gir Cow Milk',
    slug: 'a2-gir-cow-milk',
    category: 'Dairy',
    price: 95,
    image: '/dairy.png',
    description: 'Fresh raw A2 milk obtained from grass-fed native Gir cows. Free from chemical growth hormones, antibiotics, or preservation additives.',
    benefits: 'Easily digestible A2 beta-casein protein, rich in calcium and essential amino acids, enhances bone density.',
    nutrition: 'Protein: 3.3g, Fats: 3.8g, Calcium: 120mg, Vitamin D: 40 IU (per 100ml)',
    rating: 4.8,
    stock: 200,
    isOrganic: false
  },
  {
    name: 'Cold Pressed Yellow Mustard Oil',
    slug: 'cold-pressed-mustard-oil',
    category: 'Cold Pressed Oils',
    price: 260,
    image: '/oils.png',
    description: 'Wood-pressed (Kachi Ghani) oil extracted from premium yellow mustard seeds. Rich in natural aroma and pungent taste.',
    benefits: 'High in Omega-3 and monounsaturated fatty acids, improves digestion, supports cardiovascular health.',
    nutrition: 'Monounsaturated Fats: 60g, Polyunsaturated Fats: 21g, Saturated Fats: 12g (per 100ml)',
    rating: 4.9,
    stock: 90,
    isOrganic: false
  },
  {
    name: 'Cold-Pressed Pomegranate Juice',
    slug: 'cold-pressed-pomegranate-juice',
    category: 'Organic Juices',
    price: 180,
    image: '/juices.png',
    description: 'Fresh pomegranate juice extracted using hydraulic cold press. Contains zero added sugars, concentrates, or water.',
    benefits: 'Improves blood circulation, loaded with Vitamin C and potassium, reduces cellular inflammation.',
    nutrition: 'Vitamin C: 45% DV, Potassium: 290mg, Natural Sugars: 12g, Calories: 54 kcal (per 100ml)',
    rating: 4.7,
    stock: 75,
    isOrganic: true
  },
  {
    name: 'Premium Mahabaleshwar Strawberries',
    slug: 'mahabaleshwar-strawberries',
    category: 'Fresh Fruits',
    price: 140,
    image: '/produce.png',
    description: 'Fresh, juicy strawberries hand-harvested in the early morning from partner farm clusters in Mahabaleshwar.',
    benefits: 'High fiber content, rich source of vitamin C, helps control glycemic load and supports skin glowing.',
    nutrition: 'Vitamin C: 98% DV, Dietary Fiber: 2.2g, Calories: 32 kcal (per 100g)',
    rating: 4.6,
    stock: 40,
    isOrganic: false
  },
  {
    name: 'Sun-Ripened Cherry Tomatoes',
    slug: 'sun-ripened-cherry-tomatoes',
    category: 'Fresh Vegetables',
    price: 85,
    image: '/produce.png',
    description: 'Sweet and tangy heirloom cherry tomatoes grown naturally in greenhouse setups. Packed with flavor and juices.',
    benefits: 'Abundant in Lycopene and Vitamin A, supports visual acuity and strengthens arterial walls.',
    nutrition: 'Lycopene: 4.2mg, Vitamin A: 15% DV, Calories: 18 kcal, Sodium: 5mg (per 100g)',
    rating: 4.8,
    stock: 55,
    isOrganic: false
  },
  {
    name: 'Cow Ghee (Bilona Method)',
    slug: 'bilona-cow-ghee',
    category: 'Dairy',
    price: 850,
    image: '/dairy.png',
    description: 'Traditional Vedic Bilona ghee prepared from cultured curd of native cow breeds. Slowly boiled in clay pots.',
    benefits: 'Stimulates digestive fires, rich in fat-soluble vitamins (A, D, E, K), boosts gut health.',
    nutrition: 'Butyric Acid: 4.5g, Healthy Saturated Fats: 99.8g (per 100g)',
    rating: 5.0,
    stock: 140,
    isOrganic: true
  },
  {
    name: 'Spiced Mango Pickle',
    slug: 'spiced-mango-pickle',
    category: 'Pickles',
    price: 210,
    image: '/produce.png',
    description: 'Handmade, sun-dried green mango slices pickled in wood-pressed mustard oil, fenugreek, and home-ground spices.',
    benefits: 'Contains natural gut-friendly probiotic bacteria, aids digestion, contains zero chemical colors.',
    nutrition: 'Sodium: 240mg, Vitamin C: 12% DV, Carbohydrates: 3g (per 15g serving)',
    rating: 4.9,
    stock: 110,
    isOrganic: false
  },
  {
    name: 'Vedic Gir Cow A2 Ghee',
    slug: 'vedic-gir-cow-a2-ghee',
    category: 'Vedic Ghee',
    price: 1450,
    image: '/dairy.png',
    description: 'Premium A2 ghee prepared strictly via the traditional Vedic Bilona curd-churning method. Handcrafted in Rajasthan from native Gir cows.',
    benefits: 'Enhances cognitive health, lubricates joints, aids fat-soluble vitamin absorption, high smoke point.',
    nutrition: 'Butyric Acid: 4.8g, Cultured Milk Fats: 99.8g, Saturated Fats: 68g (per 100g)',
    rating: 5.0,
    stock: 80,
    isOrganic: true
  },
  {
    name: 'Vedic Cultured Buffalo Ghee',
    slug: 'vedic-cultured-buffalo-ghee',
    category: 'Vedic Ghee',
    price: 950,
    image: '/dairy.png',
    description: 'Aromatic Vedic Bilona ghee handcrafted from the cultured curd of grass-fed Murrah buffaloes in Behror.',
    benefits: 'Excellent source of healthy fats, promotes robust immunity, nourishes skin tissues.',
    nutrition: 'Murrah Buffalo Curd Fats: 99.7g, Conjugated Linoleic Acid: 1.2g (per 100g)',
    rating: 4.9,
    stock: 95,
    isOrganic: true
  },
  {
    name: 'Stone-Ground Organic Turmeric',
    slug: 'stone-ground-organic-turmeric',
    category: 'Organic Spices',
    price: 125,
    image: '/produce.png',
    description: 'Dry turmeric rhizomes slowly stone-ground (Chakki method) at low temperatures to retain high curcumin levels.',
    benefits: 'Powerful anti-inflammatory agent, active cell antioxidant, enhances natural skin glow.',
    nutrition: 'Curcumin Active: 4.8%, Dietary Fiber: 21g, Iron: 41mg (per 100g)',
    rating: 4.9,
    stock: 180,
    isOrganic: true
  },
  {
    name: 'Stone-Ground Kashmiri Chilli',
    slug: 'stone-ground-kashmiri-chilli',
    category: 'Organic Spices',
    price: 180,
    image: '/produce.png',
    description: 'Premium Kashmiri red chillies stone-ground slowly. Imparts rich deep red color with a mild, smoky heat.',
    benefits: 'Boosts metabolic rate, aids respiratory pathways, rich in Beta-Carotene and Vitamin A.',
    nutrition: 'Capsaicin Level: Mild, Vitamin A: 85% DV, Potassium: 340mg (per 100g)',
    rating: 4.8,
    stock: 150,
    isOrganic: false
  },
  {
    name: 'Stone-Ground Chana Dal',
    slug: 'stone-ground-chana-dal',
    category: 'Organic Spices',
    price: 140,
    image: '/produce.png',
    description: 'Sustainably harvested yellow gram, split and slowly stone-dehusked at our Jaipur hub to preserve natural protein structure and fiber.',
    benefits: 'High protein value, rich in dietary fiber, low glycemic index.',
    nutrition: 'Protein: 22g, Dietary Fiber: 11g, Carbohydrates: 58g (per 100g)',
    rating: 4.8,
    stock: 160,
    isOrganic: false
  },
  {
    name: 'Cold Pressed Sesame Oil',
    slug: 'cold-pressed-sesame-oil',
    category: 'Cold Pressed Oils',
    price: 290,
    image: '/oils.png',
    description: 'Wood-pressed oil extracted at low temperatures from premium black sesame seeds procured from dry land Jodhpur farm clusters.',
    benefits: 'Rich in calcium and zinc, supports bone density, loaded with sesamol antioxidants.',
    nutrition: 'Monounsaturated Fats: 40g, Polyunsaturated Fats: 42g, Vitamin E: 15% DV (per 100ml)',
    rating: 4.9,
    stock: 85,
    isOrganic: false
  },
  {
    name: 'Organic Aloe Vera Juice',
    slug: 'organic-aloe-juice',
    category: 'Organic Juices',
    price: 220,
    image: '/juices.png',
    description: 'Fresh inner-leaf Aloe Vera pulp harvested from desert family farms in Jodhpur. Cold-processed and stabilized within 4 hours.',
    benefits: 'Soothes gastrointestinal tract, supports healthy digestion, hydrates skin tissues naturally.',
    nutrition: 'Aloe Mucilage: 95%, Vitamin C: 20% DV, Calcium: 4% DV (per 100ml)',
    rating: 4.7,
    stock: 100,
    isOrganic: true
  },
  {
    name: 'Organic Garlic Powder',
    slug: 'organic-garlic-powder',
    category: 'Organic Spices',
    price: 110,
    image: '/produce.png',
    description: 'Hand-sorted native garlic bulbs from Udaipur clusters, sun-dehydrated and ground slowly without any anti-caking chemical additives.',
    benefits: 'Natural immunity booster, supports cardiovascular health, antimicrobial benefits.',
    nutrition: 'Allicin Content: High, Sodium: 0mg, Iron: 8% DV (per 100g)',
    rating: 4.9,
    stock: 130,
    isOrganic: true
  },
  {
    name: 'A2 Vedic Cultured Butter',
    slug: 'a2-vedic-cultured-butter',
    category: 'Dairy',
    price: 380,
    image: '/dairy.png',
    description: 'Cultured A2 cow butter churned by hand (using the traditional Bilona method) at our Jaipur collection center. Naturally salted.',
    benefits: 'Rich in fat-soluble vitamins, highly digestible, contains butyrate for gut barrier health.',
    nutrition: 'Cultured Milk Fat: 82g, Moisture: 16g, Protein: 0.8g (per 100g)',
    rating: 5.0,
    stock: 70,
    isOrganic: true
  },
  {
    name: 'Sun-Dried Rajasthani Green Chillies',
    slug: 'sundried-rajasthan-green-chillies',
    category: 'Pickles',
    price: 150,
    image: '/produce.png',
    description: 'Pungent Rajasthani green chillies split and pickled in wood-pressed yellow mustard oil, ground mustard seeds, and rock salt.',
    benefits: 'Acts as a digestive stimulant, rich in active capsaicin, zero chemical vinegar added.',
    nutrition: 'Capsaicin: High, Sodium: 180mg, Vitamin C: 15% DV (per 15g serving)',
    rating: 4.8,
    stock: 90,
    isOrganic: false
  }
];

async function main() {
  console.log('Seeding started...');

  // Create default admin user
  const adminEmail = 'admin@prithvora.com';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: 'admin123',
      role: 'ADMIN',
    },
  });
  console.log(`Admin user created/verified: ${admin.email}`);

  // Create default products
  for (const prod of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        price: prod.price,
        stock: prod.stock,
        description: prod.description,
        benefits: prod.benefits,
        nutrition: prod.nutrition,
        image: prod.image,
        category: prod.category,
        rating: prod.rating,
        isOrganic: prod.isOrganic,
      },
      create: prod,
    });
  }
  console.log('Products seeded successfully.');

  // Create farmers with ratings
  const farmerRamesh = await prisma.farmer.upsert({
    where: { id: 'farmer_ramesh' },
    update: {
      fullName: 'Ramesh Kumar',
      phone: '+91 96606 86394',
      state: 'Rajasthan',
      district: 'Alwar',
      farmSizeAcres: 5.5,
      primaryCrops: 'Wild Honey, Mustard Seeds',
      procurementModel: 'Contract Farming',
      status: 'APPROVED',
      rating: 4.9,
    },
    create: {
      id: 'farmer_ramesh',
      fullName: 'Ramesh Kumar',
      phone: '+91 96606 86394',
      state: 'Rajasthan',
      district: 'Alwar',
      farmSizeAcres: 5.5,
      primaryCrops: 'Wild Honey, Mustard Seeds',
      procurementModel: 'Contract Farming',
      status: 'APPROVED',
      rating: 4.9,
    }
  });

  const farmerHarpreet = await prisma.farmer.upsert({
    where: { id: 'farmer_harpreet' },
    update: {
      fullName: 'Harpreet Singh',
      phone: '+91 98765 43210',
      state: 'Rajasthan',
      district: 'Sri Ganganagar',
      farmSizeAcres: 12.0,
      primaryCrops: 'A2 Milk, Cow Ghee, Butter',
      procurementModel: 'Co-operative Pooling',
      status: 'APPROVED',
      rating: 4.8,
    },
    create: {
      id: 'farmer_harpreet',
      fullName: 'Harpreet Singh',
      phone: '+91 98765 43210',
      state: 'Rajasthan',
      district: 'Sri Ganganagar',
      farmSizeAcres: 12.0,
      primaryCrops: 'A2 Milk, Cow Ghee, Butter',
      procurementModel: 'Co-operative Pooling',
      status: 'APPROVED',
      rating: 4.8,
    }
  });

  const farmerRajendra = await prisma.farmer.upsert({
    where: { id: 'farmer_rajendra' },
    update: {
      fullName: 'Rajendra Prasad',
      phone: '+91 94140 98765',
      state: 'Rajasthan',
      district: 'Jodhpur',
      farmSizeAcres: 8.5,
      primaryCrops: 'Aloe Vera, Sesame Seeds',
      procurementModel: 'Contract Farming',
      status: 'APPROVED',
      rating: 4.7,
    },
    create: {
      id: 'farmer_rajendra',
      fullName: 'Rajendra Prasad',
      phone: '+91 94140 98765',
      state: 'Rajasthan',
      district: 'Jodhpur',
      farmSizeAcres: 8.5,
      primaryCrops: 'Aloe Vera, Sesame Seeds',
      procurementModel: 'Contract Farming',
      status: 'APPROVED',
      rating: 4.7,
    }
  });

  const farmerSita = await prisma.farmer.upsert({
    where: { id: 'farmer_sita' },
    update: {
      fullName: 'Sita Devi',
      phone: '+91 96101 23456',
      state: 'Rajasthan',
      district: 'Udaipur',
      farmSizeAcres: 4.2,
      primaryCrops: 'Mangoes, Green Chillies, Garlic',
      procurementModel: 'Daily Spot Market',
      status: 'APPROVED',
      rating: 4.9,
    },
    create: {
      id: 'farmer_sita',
      fullName: 'Sita Devi',
      phone: '+91 96101 23456',
      state: 'Rajasthan',
      district: 'Udaipur',
      farmSizeAcres: 4.2,
      primaryCrops: 'Mangoes, Green Chillies, Garlic',
      procurementModel: 'Daily Spot Market',
      status: 'APPROVED',
      rating: 4.9,
    }
  });

  const farmerVijay = await prisma.farmer.upsert({
    where: { id: 'farmer_vijay' },
    update: {
      fullName: 'Vijay Singh',
      phone: '+91 98290 65432',
      state: 'Rajasthan',
      district: 'Bikaner',
      farmSizeAcres: 10.0,
      primaryCrops: 'Turmeric, Kashmiri Chilli',
      procurementModel: 'Contract Farming',
      status: 'APPROVED',
      rating: 4.6,
    },
    create: {
      id: 'farmer_vijay',
      fullName: 'Vijay Singh',
      phone: '+91 98290 65432',
      state: 'Rajasthan',
      district: 'Bikaner',
      farmSizeAcres: 10.0,
      primaryCrops: 'Turmeric, Kashmiri Chilli',
      procurementModel: 'Contract Farming',
      status: 'APPROVED',
      rating: 4.6,
    }
  });

  const farmerMahendra = await prisma.farmer.upsert({
    where: { id: 'farmer_mahendra' },
    update: {
      fullName: 'Mahendra Jakhar',
      phone: '+91 99820 12345',
      state: 'Rajasthan',
      district: 'Jaipur',
      farmSizeAcres: 6.8,
      primaryCrops: 'A2 Gir Ghee, Buffalo Ghee, Chana Dal',
      procurementModel: 'Co-operative Pooling',
      status: 'APPROVED',
      rating: 4.8,
    },
    create: {
      id: 'farmer_mahendra',
      fullName: 'Mahendra Jakhar',
      phone: '+91 99820 12345',
      state: 'Rajasthan',
      district: 'Jaipur',
      farmSizeAcres: 6.8,
      primaryCrops: 'A2 Gir Ghee, Buffalo Ghee, Chana Dal',
      procurementModel: 'Co-operative Pooling',
      status: 'APPROVED',
      rating: 4.8,
    }
  });

  console.log('Farmers upserted with ratings successfully.');

  // Link products to farmers
  await prisma.product.updateMany({
    where: { slug: { in: ['raw-wildflower-honey', 'cold-pressed-mustard-oil'] } },
    data: { farmerId: 'farmer_ramesh' }
  });

  await prisma.product.updateMany({
    where: { slug: { in: ['a2-gir-cow-milk', 'bilona-cow-ghee', 'a2-vedic-cultured-butter'] } },
    data: { farmerId: 'farmer_harpreet' }
  });

  await prisma.product.updateMany({
    where: { slug: { in: ['organic-aloe-juice', 'cold-pressed-sesame-oil'] } },
    data: { farmerId: 'farmer_rajendra' }
  });

  await prisma.product.updateMany({
    where: { slug: { in: ['spiced-mango-pickle', 'sundried-rajasthan-green-chillies', 'organic-garlic-powder'] } },
    data: { farmerId: 'farmer_sita' }
  });

  await prisma.product.updateMany({
    where: { slug: { in: ['stone-ground-organic-turmeric', 'stone-ground-kashmiri-chilli'] } },
    data: { farmerId: 'farmer_vijay' }
  });

  await prisma.product.updateMany({
    where: { slug: { in: ['vedic-gir-cow-a2-ghee', 'vedic-cultured-buffalo-ghee', 'stone-ground-chana-dal'] } },
    data: { farmerId: 'farmer_mahendra' }
  });

  console.log('Products linked to growers successfully.');

  const partnersCount = await prisma.partner.count();
  if (partnersCount === 0) {
    await prisma.partner.createMany({
      data: [
        {
          fullName: 'Sunil Gupta',
          email: 'sunil@guptalogistics.com',
          phone: '+91 94140 12345',
          companyName: 'Gupta Cold Logistics',
          tier: 'GOLD',
          experienceYears: 4,
          investmentBudget: 1500000,
          status: 'APPROVED',
        },
        {
          fullName: 'Aman Deep',
          email: 'aman@deeporganic.com',
          phone: '+91 98140 54321',
          companyName: 'Deep Organic Clusters',
          tier: 'PLATINUM',
          experienceYears: 7,
          investmentBudget: 4000000,
          status: 'PENDING',
        }
      ]
    });
    console.log('Partners seeded.');
  }

  const investorsCount = await prisma.investorLead.count();
  if (investorsCount === 0) {
    await prisma.investorLead.createMany({
      data: [
        {
          fullName: 'Rajiv Malhotra',
          email: 'rajiv@malhotracapital.com',
          phone: '+91 99887 76655',
          investmentRange: '$250k - $1M',
          accreditedStatus: true,
          message: 'Interested in Series A details and agritech expansion roadmap.',
          status: 'NEW',
        },
        {
          fullName: 'Sanjay Shah',
          email: 'sanjay@angel.com',
          phone: '+91 98877 66554',
          investmentRange: '$50k - $250k',
          accreditedStatus: true,
          message: 'Would love to schedule a direct founder call.',
          status: 'CONTACTED',
        }
      ]
    });
    console.log('Investor leads seeded.');
  }

  const applicationsCount = await prisma.employeeApplication.count();
  if (applicationsCount === 0) {
    await prisma.employeeApplication.createMany({
      data: [
        {
          fullName: 'Rahul Sharma',
          email: 'rahul@dev.com',
          phone: '+91 97766 55443',
          position: 'Lead Full-Stack Web Engineer',
          resumeUrl: 'https://linkedin.com/in/rahulsharma',
          coverLetter: 'I have 6 years of experience working with Next.js and PostgreSQL. Excited about agritech.',
          status: 'REVIEWING',
        },
        {
          fullName: 'Priya Verma',
          email: 'priya@agri.com',
          phone: '+91 96655 44332',
          position: 'Agronomy & Soil Health Advisor',
          resumeUrl: 'https://linkedin.com/in/priyaagri',
          coverLetter: 'Dedicated agronomist focused on organic fertilizer models.',
          status: 'APPLIED',
        }
      ]
    });
    console.log('Job applications seeded.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
