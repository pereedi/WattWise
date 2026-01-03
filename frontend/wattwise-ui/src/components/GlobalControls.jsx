import { Calendar, Home } from "lucide-react";

export default function GlobalControls({
    homes,
    selectedHome,
    onHomeChange,
    start,
    end,
    onStartChange,
    onEndChange,
}) {
    return (
        <div className="flex flex-wrap gap-4 items-center bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--accent-color)]/10 rounded-lg text-[var(--accent-color)]">
                    <Home size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Select Home</span>
                    <select
                        value={selectedHome}
                        onChange={(e) => onHomeChange(e.target.value)}
                        className="bg-transparent text-[var(--text-primary)] font-semibold outline-none cursor-pointer min-w-[150px]"
                    >
                        {homes.map((h) => (
                            <option key={h.home_id} value={h.home_id} className="bg-[var(--card-bg)]">
                                {h.home_id}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="w-px h-10 bg-[var(--border-color)] mx-2 hidden sm:block" />

            <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--accent-color)]/10 rounded-lg text-[var(--accent-color)]">
                    <Calendar size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Date Range</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => onStartChange(e.target.value)}
                            className="bg-transparent text-[var(--text-primary)] text-sm font-medium outline-none cursor-pointer"
                        />
                        <span className="text-[var(--text-secondary)]">→</span>
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => onEndChange(e.target.value)}
                            className="bg-transparent text-[var(--text-primary)] text-sm font-medium outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
