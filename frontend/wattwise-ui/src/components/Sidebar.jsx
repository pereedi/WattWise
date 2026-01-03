import React from 'react';

export default function Sidebar({ activePage, setActivePage }) {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'energy', label: 'Energy Calculation', icon: '⚡' },
    ];

    return (
        <aside className="w-64 h-screen bg-[var(--card-bg)] border-l border-[var(--border-color)] fixed right-0 top-0 flex flex-col shadow-xl z-[100]">
            <div className="p-6 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-purple-500 bg-clip-text text-transparent">
                    Menu
                </h2>
            </div>
            <nav className="flex-1 py-6 space-y-2 px-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${activePage === item.id
                                ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-purple-500/20'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-6 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] text-center">
                WattWise v1.0
            </div>
        </aside>
    );
}
