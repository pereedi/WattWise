import React from 'react';
import { Home, Zap, CheckCircle2, Lock, Users, Zap as ZapIcon, Thermometer } from 'lucide-react';

export default function Welcome({ onContinue }) {
    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white p-8 font-['Inter'] flex flex-col items-center justify-center">

            <div className="w-full max-w-5xl space-y-8 animate-fade-in px-4">

                {/* Header Section */}
                <div className="text-center space-y-3 mb-8">
                    <h1 className="text-4xl font-bold">Welcome back, <span className="text-white">User</span></h1>
                    <p className="text-slate-400 text-lg">Here's a live view of how your home is using electricity today.</p>
                </div>

                {/* Main Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Card 1: Your Home */}
                    <div className="bg-[#151A29] rounded-3xl p-6 border border-white/5 space-y-4 hover:border-white/10 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-800 rounded-full shrink-0">
                                <Home className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold">Your home</h2>
                                <div className="space-y-4 mt-2">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div>
                                            <p className="text-xs text-slate-400">Type</p>
                                            <p className="text-sm font-semibold text-slate-200">2-bed Apartment</p>
                                        </div>
                                        <Thermometer className="w-4 h-4 text-cyan-400 opacity-50" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <p className="text-xs text-slate-400">Occupants</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Users className="w-3 h-3 text-slate-300" />
                                                <p className="text-sm font-semibold">2 people</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <p className="text-xs text-slate-400">Devices</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <p className="text-sm font-semibold">6 smart</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Your Electricity Plan */}
                    <div className="bg-[#151A29] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-slate-800 rounded-full shrink-0">
                                <Zap className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h2 className="text-lg font-bold mt-1">Your electricity plan</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-sm text-slate-300">Tariff Type</span>
                                <span className="font-mono text-sm font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Time-of-Use</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <p className="text-xs text-green-400 font-bold uppercase mb-1">Off-Peak</p>
                                    <p className="text-sm text-white font-mono">12am-7am</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] text-green-400 font-medium">ACTIVE NOW</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Peak</p>
                                    <p className="text-sm text-slate-300 font-mono">4pm-9pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: What WattWise Tracks - Full Width */}
                    <div className="md:col-span-2 bg-[#151A29] rounded-3xl p-6 border border-white/5 space-y-4 hover:border-white/10 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="p-3 bg-slate-800 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-violet-400" />
                                </div>
                                <h2 className="text-lg font-bold">Tracking Active</h2>
                            </div>
                            <div className="h-px w-full bg-white/10 md:hidden"></div>
                            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Real-time electricity usage",
                                    "High-energy device detection",
                                    "Peak vs Off-peak cost analysis",
                                    "Shiftable load opportunities"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                        <span className="text-sm text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer / CTA Section */}
                <div className="text-center pt-8 pb-12">
                    <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        Private to your home
                    </p>

                    <button
                        onClick={onContinue}
                        className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-slate-800 font-['Inter'] rounded-full hover:bg-slate-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:ring-offset-[#0B0F1A]"
                    >
                        <span>Continue to Dashboard</span>
                        <div className="absolute -bottom-8 flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                        </div>
                    </button>

                </div>

            </div>
        </div>
    );
}
