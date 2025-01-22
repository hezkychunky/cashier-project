'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });
const disabledHeader = ['/login'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-h-screen">
          {!disabledHeader.includes(pathName) && <Sidebar />}
          <div className="flex flex-col max-h-screen">
            {!disabledHeader.includes(pathName) && <Header />}
            <main className="w-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
