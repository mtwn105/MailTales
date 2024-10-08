import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/thumbnail.png"],
  },
  keywords: ["email", "ai", "gmail", "outlook", "yahoo", "hotmail"],
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <Script
        async
        src="https://p01--umami--fyers-api-bot--oql9-vlwk.code.run/script.js"
        data-website-id="f79b589e-599e-4be4-b6b3-bf3a601a3194"
      />
      <head />
      <body
        className={cn(
          "min-h-screen bg-custom-gradient font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col h-screen ">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-6">
              <Link
                className="flex items-center gap-1 text-current"
                href="https://x.com/mtwn105"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Made with love 💖 by </span>
                <p className="text-primary">Amit Wani</p>
              </Link>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
