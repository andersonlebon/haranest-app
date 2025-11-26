import type { Metadata } from "next";
import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppProviders from "@/providers";
import AppAppBar from "@/components/layouts/navbar";
import { Box, Container } from "@mui/material";
import Footer from "@/components/layouts/footer";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Suspense } from "react";

// export const metadata: Metadata = {
//   title: "Haranest",
//   description: "Find Home nested with care",
// };

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
          <AppAppBar/>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <AppAppBar/>
              <Box display="flex" flex={1}>
                <Container maxWidth="xl" sx={{ mt: 16, mb: 32, flexGrow: 1 }}>
                <Suspense>
                  {children}
                </Suspense>
                </Container>
              </Box>
            <Footer />
          </Box>
        </AppProviders>
      </body>
    </html>
  );
}
