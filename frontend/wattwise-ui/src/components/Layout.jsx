


export default function Layout({ children }) {
    return (
        <div className="flex bg-[var(--bg-primary)] min-h-screen w-full overflow-x-hidden justify-center">
            {/* Main Content Area */}
            <main className="w-full max-w-[1200px] p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
