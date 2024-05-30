"use client";
import Navbar from "../components/navbar";
import "../styles.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="bg-gray-800 min-h-screen min-w-screen flex justify-center items-center">
          {children}
        </div>
      </body>
    </html>
  );
}
