import Navbar from '@/components/Navbar';
import type { Metadata } from "next"; 
import { Inter } from "next/font/google"; 

const inter = Inter({ subsets: ["latin"] }); 

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "ShhBox | Anonymous Feedback",
  description: "Your secure platform for anonymous feedback and messages.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    // Applied consistent background and font to the whole page
    <html lang="en" className={`${inter.className} bg-slate-50 text-slate-800`}> 
      <body>
        <div className="flex flex-col min-h-screen">
          {/* Navbar should ideally handle its own styling (shadow, colors) */}
          <Navbar /> 
          
          <main className="flex-grow"> {/* 'main' tag for semantic correctness and flex-grow */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}