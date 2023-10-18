import { cn } from "../lib/utils";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Team Chat Application",
   description: "Clon Discord nextjs, prima, tailwind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <ClerkProvider>
         <html lang="en" suppressHydrationWarning>
            <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
               <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="discord-theme">
                  <SocketProvider>
                     <QueryProvider>
                        <ModalProvider />
                        {children}
                     </QueryProvider>
                  </SocketProvider>
               </ThemeProvider>
            </body>
         </html>
      </ClerkProvider>
   );
}
