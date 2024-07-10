import type { Metadata } from "next";
import "./styles/globals.css";
import "@/public/styles/index.scss";
import BaseLayout from "./layouts/baseLayout";
import { Providers } from "@/app/providers";
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata: Metadata = {
  title: "Examp App",
  description: "Examp app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className="container mx-auto border-solid bg-white">
          <CookiesProvider>
            <BaseLayout childComponent={children}></BaseLayout>
          </CookiesProvider>
        </body>
      </html>
    </Providers>
  );
}
