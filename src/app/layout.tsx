import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

// Using Inter as fallback since custom font files are missing
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Goals Project - Seguimiento de Metas',
  description:
    'Aplicación de seguimiento de metas personales y rendición de cuentas entre usuarios',
  keywords: ['metas', 'objetivos', 'accountability', 'productividad', 'comunidad'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
