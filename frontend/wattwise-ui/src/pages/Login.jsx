import React, { useState } from 'react';
import { User, Lock, Zap, Loader2 } from 'lucide-react';
import { login } from '../services/api';

export default function Login({ onLoginSuccess }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(userId, password);
            onLoginSuccess();
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-['Inter'] bg-[#05060a]">

            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 z-0">
                {/* Abstract light leaks/gradients matching the mockup */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[180px] opacity-70 animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                {/* Thin curved lines for elegant detail */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <path d="M0,500 Q400,300 800,600 T1600,400" fill="none" stroke="url(#lineGrad1)" strokeWidth="1" />
                    <path d="M0,800 Q500,600 1000,900 T2000,700" fill="none" stroke="url(#lineGrad2)" strokeWidth="1" />
                    <defs>
                        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* GLASS CARD CONTAINER */}
            <div className="relative  z-10 w-full max-w-[500px] p-20 bg-white/[0.04] backdrop-blur-[40px] border border-white/[0.08] rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in-up">

                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="mb-5 relative">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                        <Zap className="relative z-10 w-10 h-10 text-white fill-white" strokeWidth={0} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">WattWise</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Identity Input */}
                    <div className="space-y-2">
                        <div className="relative group">
                            {/* <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <User className="h-[18px] w-[18px] text-zinc-400 group-focus-within:text-white transition-colors duration-300" />
                            </div> */}
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="block w-full h-[60px] pl-16 pr-4 bg-black/20 border border-white/5 rounded-2xl text-[15px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-black/30 transition-all duration-300"
                                placeholder="Identity"
                                required
                            />
                        </div>
                    </div>

                    {/* Access Key Input */}
                    <div className="space-y-2">
                        <div className="relative group">
                            {/* <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-[18px] w-[18px] text-zinc-400 group-focus-within:text-white transition-colors duration-300" />
                            </div> */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full h-[60px] pl-16 pr-4 bg-black/20 border border-white/5 rounded-2xl text-[15px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-black/30 transition-all duration-300"
                                placeholder="Access Key"
                                required
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/10 rounded-xl text-red-400 text-xs font-medium text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Initialize Session Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[56px] mt-2 flex items-center justify-center bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-[15px] font-semibold rounded-2xl shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Connecting...</span>
                            </div>
                        ) : (
                            "Initialize Session"
                        )}
                    </button>

                </form>

            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-8 text-xs text-white/20 font-medium tracking-widest uppercase">
                WattWise Secure Infrastructure
            </div>
        </div>
    );
}
