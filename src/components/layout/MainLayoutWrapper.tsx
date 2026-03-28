'use client';

// Layout restructured: sidebar removed, top navbar added
// Sidebar and TopHeader are replaced with Navbar
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#eef4f8] dark:bg-gray-950 transition-colors flex flex-col">
            {/* Top Navigation Bar */}
            <Navbar />

            {/* Page Content - no sidebar margin, with top padding for fixed navbar */}
            <main className="pt-16 flex-grow">
                {children}
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
