import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ToastProvider } from "@/components/ui/toaster";
import { ChatWidget } from "@/components/chat/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1410" },
  ],
};

export const metadata: Metadata = {
  title: "Du lịch Phú Vinh AI | Phu Vinh Smart Tourism",
  description: "Ứng dụng du lịch thông minh với AI hướng dẫn viên - Khám phá xã Phú Vinh, thành phố Huế",
  keywords: ["Phú Vinh", "Huế", "du lịch", "AI", "tourism", "Vietnam", "biển", "làng nghề"],
  authors: [{ name: "Phu Vinh Tourism AI Team" }],
  openGraph: {
    title: "Du lịch Phú Vinh AI",
    description: "Khám phá xã Phú Vinh cùng hướng dẫn viên AI thông minh",
    locale: "vi_VN",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            <ToastProvider>
              <AnimatedBackground />
              <MainLayoutWrapper>
                {children}
              </MainLayoutWrapper>
              {/* ChatWidget mounted OUTSIDE MainLayoutWrapper - never unmounts on edit mode changes */}
              <ChatWidget />
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

