import { useState, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format, parseISO, startOfWeek, startOfMonth, isSameWeek, isSameMonth, endOfWeek, endOfMonth } from "date-fns";

export default function EnergyChart({ data }) {
    const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        if (viewMode === "day") {
            return data;
        }

        const groups = {};

        data.forEach((item) => {
            const date = parseISO(item.date);
            let key;

            if (viewMode === "week") {
                key = startOfWeek(date, { weekStartsOn: 1 }).toISOString();
            } else {
                key = startOfMonth(date).toISOString();
            }

            if (!groups[key]) {
                groups[key] = {
                    date: key,
                    energy_kwh: 0,
                    count: 0
                };
            }

            groups[key].energy_kwh += Number(item.energy_kwh) || 0;
            groups[key].count += 1;
        });

        return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [data, viewMode]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
                No energy data available for this range.
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const date = parseISO(label);
            let dateLabel = format(date, "MMM d, yyyy");

            if (viewMode === "week") {
                const end = endOfWeek(date, { weekStartsOn: 1 });
                dateLabel = `${format(date, "MMM d")} - ${format(end, "MMM d")}`;
            } else if (viewMode === "month") {
                dateLabel = format(date, "MMMM yyyy");
            }

            return (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 rounded-lg shadow-lg">
                    <p className="text-[var(--text-primary)] font-bold mb-1">{dateLabel}</p>
                    <p className="text-[var(--accent-color)] font-medium">
                        {Number(payload[0].value).toFixed(2)} kWh
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Energy Consumption</h3>
                <div className="flex bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--border-color)]">
                    {["day", "week", "month"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${viewMode === mode
                                    ? "bg-[var(--accent-color)] text-white shadow-sm"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => {
                                const date = parseISO(str);
                                if (viewMode === "month") return format(date, "MMM");
                                if (viewMode === "week") return format(date, "d MMM");
                                return format(date, "d MMM");
                            }}
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--accent-color)", strokeWidth: 2, strokeDasharray: "4 4" }} />
                        <Line
                            type="monotone"
                            dataKey="energy_kwh"
                            stroke="var(--accent-color)"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 0, fill: "var(--accent-color)" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
