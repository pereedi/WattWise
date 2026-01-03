import { Power, Tv, Thermometer, Monitor, Coffee, Zap } from "lucide-react";

const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("tv") || n.includes("telev")) return Tv;
    if (n.includes("heat") || n.includes("ac") || n.includes("air")) return Thermometer;
    if (n.includes("computer") || n.includes("pc")) return Monitor;
    if (n.includes("kitchen") || n.includes("coffee") || n.includes("fridge")) return Coffee;
    return Zap;
};

export default function LiveSnapshot({ appliances }) {
    // Sort by power descending
    const sorted = [...appliances].sort((a, b) => (Number(b.power_w) || 0) - (Number(a.power_w) || 0));

    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <Power size={20} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Live Snapshot</h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {sorted.map((app) => {
                    const Icon = getIcon(app.appliance_type || "unknown");
                    const power = Number(app.power_w) || 0;
                    const isOn = power > 5; // Simple threshold for "on" state visualization

                    return (
                        <div key={app.appliance_id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]/50 hover:border-[var(--accent-color)]/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isOn ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}>
                                    <Icon size={16} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-[var(--text-primary)]">{app.appliance_type}</div>
                                    <div className="text-xs text-[var(--text-secondary)] font-mono">{app.appliance_id}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${isOn ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                    {isOn ? "Active" : "Standby"}
                                </div>
                                <div className="text-right w-20">
                                    <span className="text-lg font-bold text-[var(--text-primary)]">{power.toFixed(0)}</span>
                                    <small className="text-[var(--text-secondary)] text-xs ml-1">W</small>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {sorted.length === 0 && (
                    <div className="text-center text-[var(--text-secondary)] py-8">
                        No active appliances found.
                    </div>
                )}
            </div>
        </div>
    );
}
