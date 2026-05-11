import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cilindraje 507 | La red de moteros de Panamá",
  description: "Únete a la mayor red de moteros, escanea QRs y conquista territorios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary`}>
        {/* Background elements */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-black" />
        <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Decorative blur elements */}
        <div className="pointer-events-none fixed left-1/2 top-0 -z-10 -translate-x-1/2 transform">
          <div className="h-[40rem] w-[60rem] opacity-20 blur-[100px] bg-primary rounded-full mix-blend-screen" />
        </div>

        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
