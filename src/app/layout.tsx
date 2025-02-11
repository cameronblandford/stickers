import "@/styles/globals.css";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stickers",
  description: "Get a star when you do something good!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full bg-gradient-to-br from-indigo-50 to-purple-50"
    >
      <body className={`${quicksand.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
