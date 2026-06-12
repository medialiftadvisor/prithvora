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
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

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

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
