import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pacific Northwest Studio",
  description: "Pacific Northwest Studio — cinematic visuals and stunning websites.",
  icons: {
    icon: "/pacnw-mark.svg",
    shortcut: "/pacnw-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Initial theme to avoid flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try{
                var stored = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var shouldDark = stored ? stored === 'dark' : prefersDark;
                if(shouldDark){ document.documentElement.classList.add('dark'); }
              }catch(e){}
            })();
          `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
