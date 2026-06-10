import type { Metadata } from "next";
import { League_Spartan, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";
import Providers from "@/components/layout/Providers";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PRITHVORA AGRIVERSE | From Farmers' Dreams to Every Family's Table",
  description: "PRITHVORA AGRIVERSE connects organic farmers directly with modern families, delivering premium dairy, cold pressed oils, honey, fresh produce, and organic juices.",
  keywords: ["Organic Food", "Dairy", "Honey", "Agriverse", "Farmer", "Gurugram", "Direct to Home", "Cold Pressed Oils", "Next.js 15"],
  openGraph: {
    title: "PRITHVORA AGRIVERSE",
    description: "Premium sustainable agriculture, farm-fresh dairy, honey, and organic cold-pressed items direct from Indian farms.",
    url: "https://prithvora.com",
    siteName: "PRITHVORA AGRIVERSE",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Prithvora Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRITHVORA AGRIVERSE",
    description: "Direct farm-to-home organic agritech ecosystem.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-offwhite text-spruce">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSidebar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
