import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, activePage, setActivePage }) {
    return (
        <div className="flex bg-[var(--bg-primary)] min-h-screen">
            {/* Main Content Area */}
            <main className="flex-1 mr-72 p-4">
                {children}
            </main>

            {/* Right Sidebar */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
}
