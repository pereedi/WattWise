import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { format, parseISO } from 'date-fns';
import GlobalControls from '../components/GlobalControls';
import KPICards from '../components/KPICards';
import LiveSnapshot from '../components/LiveSnapshot';
import CostChart from '../components/CostChart';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function Overview({
  homes, selectedHome, onHomeChange,
  start, end, onStartChange, onEndChange,
  liveData, dailyData, costData, allAppliancesData,
  loading, error
}) {
  const [shiftAppliance, setShiftAppliance] = useState("all");

  // 1. KPI Summaries
  const currentPower = useMemo(() => liveData.reduce((sum, item) => sum + (Number(item.power_w) || 0), 0), [liveData]);
  const totalEnergy = useMemo(() => dailyData.reduce((sum, item) => sum + (Number(item.energy_kwh) || 0), 0), [dailyData]);
  const totalCost = useMemo(() => dailyData.reduce((sum, item) => sum + (Number(item.cost_gbp) || 0), 0), [dailyData]);

  // 2. Most Expensive Appliance Data
  const expensiveApplianceData = useMemo(() => {
    const m = new Map();
    allAppliancesData.forEach(r => {
      const cost = Number(r.cost_gbp) || 0;
      m.set(r.appliance_id, (m.get(r.appliance_id) || 0) + cost);
    });
    return Array.from(m.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [allAppliancesData]);

  // 3. Shiftable Load Potential
  // logic: "flexible" appliances like heaters, washers, dryers are considered shiftable.
  const shiftableData = useMemo(() => {
    const flexiblePatterns = ['heat', 'wash', 'dry', 'dish', 'charger'];
    const m = new Map();

    allAppliancesData.forEach(r => {
      if (shiftAppliance !== "all" && r.appliance_id !== shiftAppliance) return;

      const isFlex = flexiblePatterns.some(p => r.appliance_id.toLowerCase().includes(p));
      const d = r.date;
      if (!m.has(d)) m.set(d, { date: d, flexible: 0, fixed: 0 });
      const row = m.get(d);
      if (isFlex) row.flexible += Number(r.energy_kwh) || 0;
      else row.fixed += Number(r.energy_kwh) || 0;
    });

    return Array.from(m.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [allAppliancesData, shiftAppliance]);

  const applianceOptions = useMemo(() => {
    const ids = Array.from(new Set(allAppliancesData.map(r => r.appliance_id)));
    return ["all", ...ids];
  }, [allAppliancesData]);

  if (loading && homes.length === 0) return <div className="p-8 text-center">Loading Overview...</div>;

  return (
    <div className="p-8 space-y-8 pb-24">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Overview</h1>
          <p className="text-[var(--text-secondary)]">Your home energy footprint at a glance</p>
        </div>
        <GlobalControls
          homes={homes} selectedHome={selectedHome} onHomeChange={onHomeChange}
          start={start} end={end} onStartChange={onStartChange} onEndChange={onEndChange}
        />
      </div>

      {/* KPIs */}
      <KPICards currentPower={currentPower} totalEnergy={totalEnergy} totalCost={totalCost} />

      {/* Grid 1: Power & Energy Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Power Usage (Mocked/Interpolated from Live Snapshot for visual trend) */}
        <ChartCard title="Electricity usage right now" sub="Power (W) across all active appliances">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={liveData.length > 0 ? liveData : [{ power_w: 0 }]}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="appliance_id" hide />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `${v}W`} />
              <Tooltip />
              <Area type="monotone" dataKey="power_w" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorPower)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Total Energy Used Chart */}
        <ChartCard title="Total electricity used" sub="Daily energy consumption (kWh)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
              <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), "MMM d")} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="energy_kwh" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Grid 2: Cost Breakdown & Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Breakdown (Peak vs Off-Peak) */}
        <CostChart data={costData} />

        {/* Most Expensive Appliance */}
        <ChartCard title="Most Expensive Appliance" sub="Contribution to total bill">
          <div className="flex flex-col md:flex-row items-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensiveApplianceData}
                  innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="value"
                >
                  {expensiveApplianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `£${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full md:w-48 space-y-2">
              {expensiveApplianceData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[var(--text-secondary)] truncate w-24">{entry.name}</span>
                  </div>
                  <span className="font-bold text-[var(--text-primary)]">£{entry.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Section 3: Shiftable Load & Live Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shiftable Load Potential */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Shiftable Load Potential"
            sub="Flexible vs Fixed appliance usage"
            extra={
              <select
                value={shiftAppliance}
                onChange={(e) => setShiftAppliance(e.target.value)}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs rounded-lg px-2 py-1 outline-none"
              >
                {applianceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={shiftableData}>
                <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), "MMM d")} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" />
                <Area type="monotone" dataKey="flexible" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.4} name="Flexible (Shiftable)" />
                <Area type="monotone" dataKey="fixed" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.2} name="Fixed Load" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Live Snapshot */}
        <div className="h-full">
          <LiveSnapshot appliances={liveData} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, sub, children, extra }) {
  return (
    <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{sub}</p>
        </div>
        {extra}
      </div>
      <div className="flex-1 min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
