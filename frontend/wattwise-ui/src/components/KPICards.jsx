import { Zap, Activity, DollarSign } from "lucide-react";

function KpiCard({ title, value, sub, icon: Icon, color }) {
    return (
        <div className="bg-[var(--card-bg)] p-5 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-24 -mr-8 -mt-8 rounded-full opacity-5 bg-${color}-500 blur-3xl group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

            <div className="flex justify-between items-start mb-4 z-10">
                <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:bg-[var(--accent-color)]/20 transition-colors">
                    <Icon size={20} />
                </div>
            </div>

            <div className="z-10">
                <p className="text-[var(--text-secondary)] text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{value}</h3>
                {sub && <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">{sub}</p>}
            </div>
        </div>
    );
}

export default function KPICards({ currentPower, totalEnergy, totalCost }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
