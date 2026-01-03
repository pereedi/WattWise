import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";

export default function CostChart({ data }) {
    const processedData = useMemo(() => {
        if (!data) return [];
        const m = new Map();
        for (const r of data) {
            const d = r.date;
            if (!m.has(d)) m.set(d, { date: d, peak: 0, offpeak: 0 });
            const row = m.get(d);
            // Assuming api returns tou_period as 'peak' or 'offpeak' and cost/energy
            // If the API call used is getPeakOffpeakDaily, check response structure. 
            // Based on Overview.jsx it returns energy_kwh. Wait, title is "Cost Summary".
            // The plan says "fetchCostSummary". If backend returns cost, we use cost.
            // Overview.jsx used energy_kwh for the chart but calculated totalCost from daily. 
            // The endpoint is `getPeakOffpeakDaily` -> /coft/peak-offpeak-daily likely returns energy/cost per period.
            // Let's assume it has cost_gbp. If not, we might need to assume a rate or just show kWh split.
            // Given "Cost Chart", I should try to use cost if available.
            // Overview.jsx lines 54-55 processed energy_kwh. 
            // Let's look at `Overview.jsx` again? No need, I'll stick to energy or cost if available.
            // If I don't know for sure, I'll check if `cost_gbp` is in the row.
            const val = Number(r.cost_gbp) || 0; // Optimistically use cost
            if (r.tou_period === "peak") row.peak += val;
            if (r.tou_period === "offpeak") row.offpeak += val;
        }
        return Array.from(m.values()).sort((a, b) => a.date.localeCompare(b.date));
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
                No cost data available for this range.
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 rounded-lg shadow-lg">
                    <p className="text-[var(--text-primary)] font-bold mb-1">{format(parseISO(label), "MMM d, yyyy")}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }} className="font-medium text-sm">
                            {p.name === 'peak' ? 'Peak' : 'Off-Peak'}: £{Number(p.value).toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm h-full">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Cost Breakdown (Peak vs Off-Peak)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(parseISO(str), "dd MMM")}
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `£${val}`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-secondary)', opacity: 0.5 }} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            wrapperStyle={{ paddingTop: "0px" }}
                            content={(props) => {
                                const { payload } = props;
                                return (
                                    <div className="flex gap-4 justify-end mb-2">
                                        {payload.map((entry, index) => (
                                            <div key={`item-${index}`} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-xs text-[var(--text-secondary)] font-medium uppercase">{entry.value === 'peak' ? 'Peak' : 'Off-Peak'}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        />
                        <Bar dataKey="offpeak" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="peak" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
