import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "North Bengal Handmade Products BD | Modern Artisanal Handicrafts Exporter",
  description: "Direct manufacturer & exporter of authentic Rangpur Shatranji, handwoven jute rugs, sustainable seagrass baskets, and eco home decor from Bangladesh.",
  keywords: ["North Bengal Handmade Products BD", "Rangpur Shatranji", "Bangladesh Jute Exporter", "Handicrafts Exporter Bangladesh", "ERC 260326211291422"],
  openGraph: {
    title: "North Bengal Handmade Products BD - Global Eco-Craft Exporter",
    description: "Authentic Bangladeshi Handwoven Jute Rugs, Shatranji, and Eco Decor.",
    url: "https://northbengalhandmade.com",
    siteName: "North Bengal Handmade Products BD",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable}`}>
      <body className="font-sans antialiased bg-linen-50 text-stone-800">
        {children}
      </body>
    </html>
  );
}
