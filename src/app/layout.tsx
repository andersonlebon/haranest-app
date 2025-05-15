import type { Metadata } from "next";
import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppProviders from "@/providers";



export const metadata: Metadata = {
  title: "Haranest",
  description: "Find Home nested with care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />

      </head>
      <body>
        <AppProviders>
        {children}
        </AppProviders>
      </body>
    </html>
  );
}
