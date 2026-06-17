'use server';

import { db } from '@/lib/db';
import { Role, OrderStatus, PartnerTier } from '@prisma/client';
import { revalidatePath as nextRevalidatePath } from 'next/cache';
import { sendMail, getFarmerEmailTemplate, getContactEmailTemplate, getPartnerEmailTemplate, getInvestorEmailTemplate, getCareersEmailTemplate } from '@/lib/email';

function revalidatePath(path: string) {
  try {
    nextRevalidatePath(path);
  } catch (error) {
    // Suppress "static generation store missing" errors when executed outside Next.js router context
  }
}


// ==========================================
// 1. PRODUCTS ACTIONS
// ==========================================

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      include: {
        farmer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw new Error(error.message || 'Failed to connect to database.');
  }
}

export async function addProduct(data: {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  shortDescription?: string;
  benefits?: string;
  nutrition?: string;
  keyHighlights?: string;
  keyFeatures?: string;
  image?: string;
  farmerId?: string;
}) {
  try {
    let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      const suffix = Math.random().toString(36).substring(2, 7);
      slug = `${slug}-${suffix}`;
    }

    const price = Number(data.price);
    const stock = Math.round(Number(data.stock));
    if (isNaN(price) || isNaN(stock)) {
      throw new Error("Price and Stock must be valid numbers.");
    }
    const parsedFarmerId = (data.farmerId && data.farmerId.trim() !== '') ? data.farmerId : null;

    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        category: data.category,
        price,
        stock,
        description: data.description || 'Fresh organic product direct from farmers.',
        shortDescription: data.shortDescription || null,
        benefits: data.benefits || null,
        nutrition: data.nutrition || null,
        keyHighlights: data.keyHighlights || null,
        keyFeatures: data.keyFeatures || null,
        image: data.image || '/produce.png',
        rating: 5.0,
        isOrganic: true,
        farmerId: parsedFarmerId,
      },
    });
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message || 'Failed to add product.' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product.' };
  }
}

// ==========================================
// 2. ORDERS ACTIONS
// ==========================================

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function createOrder(data: {
  userId?: string;
  shippingAddress: string;
  discountApplied?: number;
  couponCode?: string;
  paymentMethod: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
}) {
  try {
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await db.$transaction(async (tx) => {
      // 1. Verify stock of each item and create the order
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Decrement product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Verify if userId exists and is not a mock ID to prevent foreign key constraint failures
      let finalUserId: string | null = null;
      if (data.userId && !data.userId.startsWith('mock-')) {
        const user = await tx.user.findUnique({
          where: { id: data.userId },
        });
        if (user) {
          finalUserId = user.id;
        }
      }

      if (!finalUserId) {
        throw new Error("Checkout requires a registered customer account. Please register or sign in.");
      }

      // 3. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: finalUserId,
          shippingAddress: data.shippingAddress,
          totalAmount: totalAmount - (data.discountApplied || 0),
          discountApplied: data.discountApplied || 0.0,
          couponCode: data.couponCode || null,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          status: 'PENDING',
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return newOrder;
    });

    revalidatePath('/admin');
    revalidatePath('/products');
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to place order.' };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await db.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin');
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message || 'Failed to update order status.' };
  }
}

// ==========================================
// 3. FARMERS ACTIONS
// ==========================================

export async function getFarmers() {
  try {
    const farmers = await db.farmer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(farmers));
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return [];
  }
}

export async function registerFarmer(data: {
  fullName: string;
  phone: string;
  state: string;
  district: string;
  farmSizeAcres: number;
  primaryCrops: string;
  procurementModel: string;
}) {
  try {
    if (data.state !== 'Rajasthan') {
      throw new Error("Farmer program registration is currently restricted to Rajasthan only.");
    }
    const farmer = await db.farmer.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.district,
        farmSizeAcres: data.farmSizeAcres,
        primaryCrops: data.primaryCrops,
        procurementModel: data.procurementModel,
        status: 'PENDING',
      },
    });
    revalidatePath('/admin');
    
    // Dispatch email notification asynchronously without blocking response
    sendMail({
      subject: `New Farmer Registration: ${data.fullName} (${data.district})`,
      html: getFarmerEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch farmer registration email:', err));

    return { success: true, farmerId: farmer.id };
  } catch (error: any) {
    console.error('Error registering farmer:', error);
    return { success: false, error: error.message || 'Failed to submit registration.' };
  }
}

export async function approveFarmer(id: string) {
  try {
    const farmer = await db.farmer.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
    revalidatePath('/admin');
    return { success: true, farmer: JSON.parse(JSON.stringify(farmer)) };
  } catch (error: any) {
    console.error('Error approving farmer:', error);
    return { success: false, error: error.message || 'Failed to approve farmer.' };
  }
}

// ==========================================
// 4. PARTNERS ACTIONS
// ==========================================

export async function getPartners() {
  try {
    const partners = await db.partner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(partners));
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

export async function registerPartner(data: {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  tier: PartnerTier;
  experienceYears: number;
  investmentBudget: number;
}) {
  try {
    const partner = await db.partner.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName || null,
        tier: data.tier,
        experienceYears: data.experienceYears,
        investmentBudget: data.investmentBudget,
        status: 'PENDING',
      },
    });
    revalidatePath('/admin');

    // Dispatch email notification asynchronously
    sendMail({
      subject: `New Franchise Partner Request: ${data.fullName} (${data.tier})`,
      html: getPartnerEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch partner email:', err));

    return { success: true, partnerId: partner.id };
  } catch (error: any) {
    console.error('Error registering partner:', error);
    return { success: false, error: error.message || 'Failed to submit partnership intent.' };
  }
}

export async function approvePartner(id: string) {
  try {
    const partner = await db.partner.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
    revalidatePath('/admin');
    return { success: true, partner: JSON.parse(JSON.stringify(partner)) };
  } catch (error: any) {
    console.error('Error approving partner:', error);
    return { success: false, error: error.message || 'Failed to approve partner.' };
  }
}

// ==========================================
// 5. INVESTORS ACTIONS
// ==========================================

export async function getInvestors() {
  try {
    const investors = await db.investorLead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(investors));
  } catch (error) {
    console.error('Error fetching investors:', error);
    return [];
  }
}

export async function submitInvestorLead(data: {
  fullName: string;
  email: string;
  phone: string;
  investmentRange: string;
  accreditedStatus: boolean;
  message?: string;
}) {
  try {
    const lead = await db.investorLead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        investmentRange: data.investmentRange,
        accreditedStatus: data.accreditedStatus,
        message: data.message || null,
        status: 'NEW',
      },
    });
    revalidatePath('/admin');

    // Dispatch email notification asynchronously
    sendMail({
      subject: `New Investor Lead: ${data.fullName} (${data.investmentRange})`,
      html: getInvestorEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch investor email:', err));

    return { success: true, leadId: lead.id };
  } catch (error: any) {
    console.error('Error submitting investor lead:', error);
    return { success: false, error: error.message || 'Failed to submit investor request.' };
  }
}

export async function contactInvestor(id: string) {
  try {
    const lead = await db.investorLead.update({
      where: { id },
      data: { status: 'CONTACTED' },
    });
    revalidatePath('/admin');
    return { success: true, lead: JSON.parse(JSON.stringify(lead)) };
  } catch (error: any) {
    console.error('Error contacting investor:', error);
    return { success: false, error: error.message || 'Failed to mark investor as contacted.' };
  }
}

// ==========================================
// 6. CAREERS ACTIONS
// ==========================================

export async function getCareersApplications() {
  try {
    const apps = await db.employeeApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(apps));
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

export async function submitCareersApplication(data: {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  resumeUrl?: string;
  coverLetter?: string;
}) {
  try {
    const app = await db.employeeApplication.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        resumeUrl: data.resumeUrl || null,
        coverLetter: data.coverLetter || null,
        status: 'APPLIED',
      },
    });
    revalidatePath('/admin');

    // Dispatch email notification asynchronously
    sendMail({
      subject: `New Job Application: ${data.fullName} - ${data.position}`,
      html: getCareersEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch careers email:', err));

    return { success: true, applicationId: app.id };
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return { success: false, error: error.message || 'Failed to submit career application.' };
  }
}

// ==========================================
// 7. CONTACT MESSAGES ACTIONS
// ==========================================

export async function getContactMessages() {
  try {
    return await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    const msg = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        status: 'UNREAD',
      },
    });

    // Dispatch email notification asynchronously
    sendMail({
      subject: `New Contact Inquiry: ${data.subject}`,
      html: getContactEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch contact email:', err));

    return { success: true, messageId: msg.id };
  } catch (error: any) {
    console.error('Error submitting contact message:', error);
    return { success: false, error: error.message || 'Failed to submit contact message.' };
  }
}

// ==========================================
// 8. CUSTOMER & ACCOUNT PORTAL ACTIONS
// ==========================================

export async function registerCustomer(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return { success: false, error: 'A user with this email already exists.' };
    }

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'USER',
      },
    });
    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error('Error registering customer:', error);
    return { success: false, error: error.message || 'Registration failed.' };
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    });
    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message || 'Profile update failed.' };
  }
}

export async function getUserOrders(userId: string) {
  try {
    return await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    return await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    shortDescription?: string;
    benefits?: string;
    nutrition?: string;
    keyHighlights?: string;
    keyFeatures?: string;
    image?: string;
    farmerId?: string;
  }
) {
  try {
    let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existingProduct = await db.product.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });
    if (existingProduct) {
      const suffix = Math.random().toString(36).substring(2, 7);
      slug = `${slug}-${suffix}`;
    }

    const price = Number(data.price);
    const stock = Math.round(Number(data.stock));
    if (isNaN(price) || isNaN(stock)) {
      throw new Error("Price and Stock must be valid numbers.");
    }
    const parsedFarmerId = (data.farmerId && data.farmerId.trim() !== '') ? data.farmerId : null;

    const product = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        category: data.category,
        price,
        stock,
        description: data.description || 'Fresh organic product direct from farmers.',
        shortDescription: data.shortDescription || null,
        benefits: data.benefits || null,
        nutrition: data.nutrition || null,
        keyHighlights: data.keyHighlights || null,
        keyFeatures: data.keyFeatures || null,
        image: data.image || '/produce.png',
        farmerId: parsedFarmerId,
      },
    });
    revalidatePath('/products');
    revalidatePath(`/products/${slug}`);
    revalidatePath('/admin');
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product.' };
  }
}

export async function getCustomers() {
  try {
    const customers = await db.user.findMany({
      where: { role: Role.USER },
      orderBy: { createdAt: 'desc' },
    });
    return JSON.parse(JSON.stringify(customers));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
) {
  try {
    const customer = await db.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    });
    revalidatePath('/admin');
    return { success: true, customer: JSON.parse(JSON.stringify(customer)) };
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return { success: false, error: error.message || 'Failed to update customer.' };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return { success: false, error: error.message || 'Failed to delete customer.' };
  }
}

export async function updateFarmer(
  id: string,
  data: {
    fullName?: string;
    phone?: string;
    state?: string;
    district?: string;
    farmSizeAcres?: number;
    primaryCrops?: string;
    procurementModel?: string;
    rating?: number;
    status?: string;
  }
) {
  try {
    const farmer = await db.farmer.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.district,
        farmSizeAcres: data.farmSizeAcres,
        primaryCrops: data.primaryCrops,
        procurementModel: data.procurementModel,
        rating: data.rating,
        status: data.status,
      },
    });
    revalidatePath('/admin');
    return { success: true, farmer: JSON.parse(JSON.stringify(farmer)) };
  } catch (error: any) {
    console.error('Error updating farmer:', error);
    return { success: false, error: error.message || 'Failed to update farmer.' };
  }
}

export async function deleteFarmer(id: string) {
  try {
    await db.farmer.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting farmer:', error);
    return { success: false, error: error.message || 'Failed to delete farmer.' };
  }
}

export async function deletePartner(id: string) {
  try {
    await db.partner.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return { success: false, error: error.message || 'Failed to delete partner.' };
  }
}

export async function deleteInvestor(id: string) {
  try {
    await db.investorLead.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting investor lead:', error);
    return { success: false, error: error.message || 'Failed to delete investor lead.' };
  }
}

// ==========================================
// 9. MULTI-ROLE DASHBOARD ACTIONS
// ==========================================

export async function getUserDashboardRoles(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        farmer: {
          include: {
            products: true,
          },
        },
        partner: true,
        investorLead: true,
      },
    });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    return {
      success: true,
      roles: {
        farmer: user.farmer ? JSON.parse(JSON.stringify(user.farmer)) : null,
        partner: user.partner ? JSON.parse(JSON.stringify(user.partner)) : null,
        investorLead: user.investorLead ? JSON.parse(JSON.stringify(user.investorLead)) : null,
      },
    };
  } catch (error: any) {
    console.error('Error fetching user dashboard roles:', error);
    return { success: false, error: error.message || 'Failed to fetch roles.' };
  }
}

export async function requestFarmerRole(userId: string, data: {
  fullName: string;
  phone: string;
  state: string;
  district: string;
  farmSizeAcres: number;
  primaryCrops: string;
  procurementModel: string;
}) {
  try {
    if (data.state !== 'Rajasthan') {
      throw new Error("Farmer program registration is currently restricted to Rajasthan only.");
    }
    const existingFarmer = await db.farmer.findFirst({
      where: { userId },
    });
    if (existingFarmer) {
      throw new Error("You have already submitted a farmer application.");
    }

    const farmer = await db.farmer.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.district,
        farmSizeAcres: Number(data.farmSizeAcres),
        primaryCrops: data.primaryCrops,
        procurementModel: data.procurementModel,
        status: 'PENDING',
        userId: userId,
      },
    });
    revalidatePath('/account');
    revalidatePath('/admin');

    // Dispatch email notification asynchronously
    sendMail({
      subject: `New Farmer Registration: ${data.fullName} (${data.district})`,
      html: getFarmerEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch farmer registration email:', err));

    return { success: true, farmerId: farmer.id };
  } catch (error: any) {
    console.error('Error requesting farmer role:', error);
    return { success: false, error: error.message || 'Failed to submit request.' };
  }
}

export async function requestPartnerRole(userId: string, data: {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  tier: PartnerTier;
  experienceYears: number;
  investmentBudget: number;
}) {
  try {
    const existingPartner = await db.partner.findFirst({
      where: { userId },
    });
    if (existingPartner) {
      throw new Error("You have already submitted a partner application.");
    }

    const partner = await db.partner.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName || null,
        tier: data.tier,
        experienceYears: Number(data.experienceYears),
        investmentBudget: Number(data.investmentBudget),
        status: 'PENDING',
        userId: userId,
      },
    });
    revalidatePath('/account');
    revalidatePath('/admin');

    sendMail({
      subject: `New Franchise Partner Request: ${data.fullName} (${data.tier})`,
      html: getPartnerEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch partner email:', err));

    return { success: true, partnerId: partner.id };
  } catch (error: any) {
    console.error('Error requesting partner role:', error);
    return { success: false, error: error.message || 'Failed to submit request.' };
  }
}

export async function requestInvestorRole(userId: string, data: {
  fullName: string;
  email: string;
  phone: string;
  investmentRange: string;
  accreditedStatus: boolean;
  message?: string;
}) {
  try {
    const existingInvestor = await db.investorLead.findFirst({
      where: { userId },
    });
    if (existingInvestor) {
      throw new Error("You have already submitted an investor application.");
    }

    const lead = await db.investorLead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        investmentRange: data.investmentRange,
        accreditedStatus: data.accreditedStatus,
        message: data.message || null,
        status: 'NEW',
        userId: userId,
      },
    });
    revalidatePath('/account');
    revalidatePath('/admin');

    sendMail({
      subject: `New Investor Lead: ${data.fullName} (${data.investmentRange})`,
      html: getInvestorEmailTemplate(data),
    }).catch(err => console.error('Failed to dispatch investor email:', err));

    return { success: true, leadId: lead.id };
  } catch (error: any) {
    console.error('Error requesting investor role:', error);
    return { success: false, error: error.message || 'Failed to submit request.' };
  }
}

export async function updateFarmerProductInventory(productId: string, price: number, stock: number) {
  try {
    const updated = await db.product.update({
      where: { id: productId },
      data: {
        price: Number(price),
        stock: Math.round(Number(stock)),
      },
    });
    revalidatePath('/products');
    revalidatePath('/admin');
    revalidatePath('/account');
    return { success: true, product: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error('Error updating farmer inventory:', error);
    return { success: false, error: error.message || 'Failed to update inventory.' };
  }
}

export async function submitDashboardFeedback(data: {
  name: string;
  email: string;
  message: string;
  type: string;
}) {
  try {
    const msg = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: `Dashboard Support/Feedback (${data.type})`,
        message: data.message,
        status: 'UNREAD',
      },
    });

    sendMail({
      subject: `Dashboard Support/Feedback (${data.type}) from ${data.name}`,
      html: `<p><strong>Name:</strong> ${data.name}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Type:</strong> ${data.type}</p>
             <p><strong>Message:</strong></p>
             <p>${data.message.replace(/\\n/g, '<br/>')}</p>`,
    }).catch(err => console.error('Failed to dispatch support feedback email:', err));

    return { success: true, messageId: msg.id };
  } catch (error: any) {
    console.error('Error submitting dashboard feedback:', error);
    return { success: false, error: error.message || 'Failed to submit feedback.' };
  }
}


