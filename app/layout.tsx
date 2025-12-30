import type { Metadata } from "next";
import { AuthProvider } from './context/AuthContext';
import "./globals.css";

export const metadata: Metadata = {
  title: "Advanced Scientific Calculator",
  description: "Full-featured scientific calculator with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}