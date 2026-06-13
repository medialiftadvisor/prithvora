import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await db.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return {
        title: 'Product Not Found | PRITHVORA AGRIVERSE',
        description: 'The requested organic farm product was not found in our catalog.',
      };
    }

    return {
      title: `${product.name} | PRITHVORA AGRIVERSE`,
      description: product.description,
      openGraph: {
        title: `${product.name} | PRITHVORA AGRIVERSE`,
        description: product.description,
        images: [{ url: product.image }],
      },
    };
  } catch (error) {
    console.error('Metadata generation database error:', error);
    return {
      title: 'Database Connection Error | PRITHVORA AGRIVERSE',
      description: 'Experiencing temporary issues connecting to our organic agri-database.',
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    // Fetch product details
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        farmer: true,
      },
    });

    if (!product) {
      notFound();
    }

    // Fetch related products
    const relatedProducts = await db.product.findMany({
      where: {
        category: product.category,
        NOT: {
          id: product.id,
        },
      },
      take: 4,
    });

    // Safe serialization for Client Component transfer
    const serializedProduct = JSON.parse(JSON.stringify(product));
    const serializedRelated = JSON.parse(JSON.stringify(relatedProducts));

    return (
      <ProductDetailClient 
        product={serializedProduct} 
        relatedProducts={serializedRelated} 
      />
    );
  } catch (error: any) {
    console.error('Error rendering product details Server Component:', error);
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border border-red-100 max-w-md w-full shadow-lg text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex justify-center items-center text-red-500 mx-auto">
            <span className="text-xl font-bold">!</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-league font-bold text-spruce">Database Connection Issue</h3>
            <p className="text-xs text-red-600 leading-relaxed font-semibold">Could not retrieve product details</p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              We are experiencing temporary issues connecting to our organic agri-database. Please verify your connection status and ensure the database is running.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
