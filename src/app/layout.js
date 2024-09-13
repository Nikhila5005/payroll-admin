'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar/page";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname and useRouter
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path
  const router = useRouter(); // Get the router object


  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ display: 'flex' }}>
          {/* Conditionally render Navbar only if not on the /Login page */}
          {pathname !== "/Login" && <Navbar />}
          <div
            style={{
              flexGrow: 1,
              padding: '3px',
              marginTop: pathname !== "/Login" ? '60px' : '0', // Adjust marginTop based on the page
              marginLeft: pathname !== "/Login" ? '4px' : '0', // Adjust marginLeft based on the page
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
