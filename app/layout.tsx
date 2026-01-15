import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DongDong Admin',
  description: 'DongDong Backoffice',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

