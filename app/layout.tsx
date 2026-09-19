import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import HeaderGuard from "../components/HeaderGuard";
import FooterGuard from "@/components/FooterGuard";

const lato = Lato({
  subsets: ["latin"],
  // Lato has no native 500 face; CSS uses its requested 500 UI weight with
  // the browser's standard synthesized medium face.
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grouh Academy",
  description: "Practical digital skills and internship opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${lato.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <HeaderGuard />
        {children}
        <FooterGuard />
      </body>
    </html>
  );
}
