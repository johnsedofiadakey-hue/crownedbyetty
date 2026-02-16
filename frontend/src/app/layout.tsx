import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import BrandingProvider from "@/components/BrandingProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "Crowned By Etty | Premium Hair Growth",
  description: "Luxurious, raw botanical hair growth solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${manrope.variable} font-sans antialiased bg-background text-foreground`}
      >
        <BrandingProvider />
        {children}
      </body>
    </html>
  );
}