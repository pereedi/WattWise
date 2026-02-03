import { Zap, Activity, DollarSign } from "lucide-react";

function KpiCard({ title, value, sub, icon: Icon, color }) {
    return (
        <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)] shadow-xl flex flex-col justify-between min-h-[220px] relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-[var(--accent-color)]/30">
            {/* Enhanced Background Glow */}
            <div className={`absolute top-0 right-0 p-32 -mr-12 -mt-12 rounded-full opacity-10 bg-${color}-500 blur-3xl group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />

            <div className="flex justify-between items-start z-10">
                <p className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest">{title}</p>
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-white group-hover:bg-[var(--accent-color)] transition-all duration-300 shadow-inner">
                    <Icon size={24} />
                </div>
            </div>

            <div className="z-10 flex-1 flex flex-col justify-center">
                <h3 className="text-4xl font-black text-[var(--text-primary)] tracking-tight mb-2 transition-transform duration-300 group-hover:translate-x-1 origin-left">
                    {value}
                </h3>
                {sub && (
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 animate-pulse`} />
                        <p className="text-xs text-[var(--text-secondary)] font-medium">{sub}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function KPICards({ currentPower, totalEnergy, totalCost }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <KpiCard
                title="Current Power"
                value={`${currentPower.toFixed(0)} W`}
                sub="Live consumption"
                icon={Zap}
                color="yellow"
            />
            <KpiCard
                title="Total Energy"
                value={`${totalEnergy.toFixed(1)} kWh`}
                sub="Selected range"
                icon={Activity}
                color="blue"
            />
            <KpiCard
                title="Est. Cost"
                value={`£${totalCost.toFixed(2)}`}
                sub="Based on TOU rates"
                icon={DollarSign}
                color="green"
            />
        </div>
    );
}
