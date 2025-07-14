import { AuthProvider } from '@/lib/firebase';
import Navbar from '@/components/navbar';
import '@/index.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="bg-gray-800 min-h-screen min-w-screen flex justify-center items-center">
        {children}
      </div>
    </AuthProvider>
  );
}
