import { DataProvider } from '../context/DataContext';
import Navbar from '../components/Navbar';

// This is your root layout, it's a Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', background: '#f9f9f9' }}>
        <DataProvider> {/* Context Provider wraps everything */}
          <Navbar />
          <main style={{ padding: '20px' }}>
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  );
}