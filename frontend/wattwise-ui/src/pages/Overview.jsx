import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Zap, ArrowRight, Activity, CreditCard, RotateCcw, LogOut } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function Overview({
  homes, selectedHome, onHomeChange,
  start, end, onStartChange, onEndChange,
  liveData, dailyData, costData, allAppliancesData,
  loading, error,
  setActivePage,
  ...restProps
}) {

  // -- Data Processing --
  const currentPower = useMemo(() => liveData.reduce((sum, item) => sum + (Number(item.power_w) || 0), 0), [liveData]);

  // State
  const [pieActiveIndex, setPieActiveIndex] = useState(null);
  const [selectedShiftableAppliance, setSelectedShiftableAppliance] = useState('all');

  const uniqueAppliances = useMemo(() => {
    const apps = new Set(allAppliancesData.map(d => d.appliance_id));
    return Array.from(apps).sort();
  }, [allAppliancesData]);

  // Shiftable Data Logic
  const shiftableData = useMemo(() => {
    const flexiblePatterns = ['heat', 'wash', 'dry', 'dish', 'charger'];
    const m = new Map();
    allAppliancesData.forEach(r => {
      // Filter if specific appliance selected
      if (selectedShiftableAppliance !== 'all' && r.appliance_id !== selectedShiftableAppliance) return;

      const isFlex = flexiblePatterns.some(p => r.appliance_id.toLowerCase().includes(p));
      const d = r.date;
      if (!m.has(d)) m.set(d, { date: d, flexible: 0, fixed: 0 });
      const row = m.get(d);
      if (isFlex) row.flexible += Number(r.energy_kwh) || 0;
      else row.fixed += Number(r.energy_kwh) || 0;
    });
    return Array.from(m.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [allAppliancesData, selectedShiftableAppliance]);

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


  if (loading && homes.length === 0) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-16 pb-24 font-['Inter'] animate-fade-in">

      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 mt-1">Your detailed energy consumption analysis</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivePage && setActivePage('energy')}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 hover:scale-105 transition-all duration-200 border border-white/5"
          >
            <span>Energy Calculation</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={restProps.onLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-colors border border-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 1. Current Energy Usage (Live) - Featured Card */}
      <div className="bg-[#151A29] rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-300 shadow-2xl shadow-black/20">
        <div className="absolute top-0 right-0 p-[200px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center z-10 relative mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              Current Energy Usage
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Right now, your home is drawing <span className="text-white font-bold">{currentPower} W</span>. This live feed updates instantly.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">LIVE CONSUMPTION</p>
            <div className="flex items-center gap-3 justify-end">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="text-white font-mono text-3xl font-bold tracking-tight">{currentPower} <span className="text-base font-sans text-slate-500 font-normal">W</span></span>
            </div>
          </div>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveData.length > 0 ? liveData : [{ power_w: 0 }]}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="power_w"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#colorPower)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Recent Electricity Use (Bar Chart) */}
      <div className="bg-[#151A29] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              Recent Electricity Use
            </h2>
            <p className="text-slate-400 text-sm mt-2">Daily consumption over the last 30 days.</p>
          </div>
          {/* Stats Summary - Pills */}
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Avg Cost</p>
              <p className="text-white font-bold font-mono">£5.44<span className="text-xs text-slate-500 font-sans ml-1">/day</span></p>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Peak Usage</p>
              <p className="text-red-400 font-bold font-mono">63%</p>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), "d")} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12, dy: 10 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="energy_kwh" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Cost Breakdown (Bar + Pie) */}
      <div className="bg-[#151A29] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-400" />
              </div>
              Cost Breakdown
            </h2>
            <p className="text-slate-400 text-sm mt-2">Comparing peak vs off-peak costs and top appliances.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart Section */}
          <div className="lg:col-span-2 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), "d")} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12, dy: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="peak_cost" name="Peak Cost" stackId="a" fill="#EF4444" radius={[0, 0, 4, 4]} maxBarSize={40} />
                <Bar dataKey="off_peak_cost" name="Off-Peak Cost" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Section */}
          <div className="h-[280px] relative bg-black/10 rounded-2xl border border-white/5 p-4 flex items-center justify-between">
            {/* Left: Chart */}
            <div className="relative w-[60%] h-full">
              <h3 className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 w-full text-center z-10">Top Spenders</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensiveApplianceData}
                    innerRadius={55} outerRadius={75}
                    paddingAngle={5} dataKey="value" stroke="none"
                    onMouseEnter={(_, index) => setPieActiveIndex(index)}
                    onMouseLeave={() => setPieActiveIndex(null)}
                  >
                    {expensiveApplianceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieActiveIndex === index ? '#FFFFFF' : COLORS[index % COLORS.length]}
                        className="transition-colors duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `£${v.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#000000', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text overlay for Pie */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-center pointer-events-none">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Total</span>
                <span className="text-lg font-bold text-white">£{expensiveApplianceData.reduce((a, b) => a + b.value, 0).toFixed(0)}</span>
              </div>
            </div>

            {/* Right: Legend */}
            <div className="flex flex-col justify-center gap-3 w-[40%] pl-2 border-l border-white/5 overflow-y-auto max-h-full custom-scrollbar">
              {expensiveApplianceData.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-xs transition-opacity duration-200 ${pieActiveIndex !== null && pieActiveIndex !== index ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setPieActiveIndex(index)}
                  onMouseLeave={() => setPieActiveIndex(null)}
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pieActiveIndex === index ? '#fff' : COLORS[index % COLORS.length] }}></div>
                  <span className={`truncate capitalize ${pieActiveIndex === index ? 'text-white' : 'text-slate-400'}`}>{entry.name.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Most Energy Usage & Shiftable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shiftable Load */}
        <div className="bg-[#151A29] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors duration-300">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-indigo-400" />
                </div>
                Shiftable Opportunities
              </h2>
              <p className="text-slate-400 text-sm mt-2">Potential flexible load separation.</p>
            </div>

            {/* Appliance Selector */}
            <div className="relative z-20">
              <select
                value={selectedShiftableAppliance}
                onChange={(e) => setSelectedShiftableAppliance(e.target.value)}
                className="bg-black/20 border border-white/10 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500/50 appearance-none pr-10 cursor-pointer hover:bg-black/30 transition-all duration-200 min-w-[140px]"
              >
                <option value="all">All Appliances</option>
                {uniqueAppliances.map(app => (
                  <option key={app} value={app}>{app.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shiftableData}>
                <defs>
                  <linearGradient id="colorFlex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="flexible" stackId="1" stroke="#10B981" fill="url(#colorFlex)" name="Flexible" />
                <Area type="monotone" dataKey="fixed" stackId="1" stroke="#374151" fill="#374151" name="Fixed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Device Status List */}
        <div className="bg-[#151A29] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors duration-300">
          <h2 className="text-xl font-bold text-white mb-6">Live Device Status</h2>
          <div className="space-y-3">
            {liveData.slice(0, 5).map((device, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm text-slate-200 font-medium capitalize">{device.appliance_id.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-mono font-bold block">{device.power_w} W</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active</span>
                </div>
              </div>
            ))}
            {liveData.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No active devices detected.</p>}
          </div>
        </div>
      </div>

    </div>
  );
}
