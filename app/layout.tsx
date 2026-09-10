import type { Metadata } from "next";
import "./globals.css";
import HeaderGuard from "../components/HeaderGuard";
import FooterGuard from "@/components/FooterGuard";

export const metadata: Metadata = {
  title: "Grouh Academy",
  description: "Practical digital skills and internship opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className= "h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <HeaderGuard />
        {children}
        <FooterGuard />
      </body>
    </html>
  );
}
