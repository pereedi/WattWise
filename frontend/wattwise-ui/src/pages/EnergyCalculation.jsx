import React from 'react';
import Dashboard from '../components/Dashboard';

import { ArrowLeft } from 'lucide-react';

export default function EnergyCalculation(props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => props.setActivePage && props.setActivePage('overview')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Overview</span>
                </button>
                <h1 className="text-2xl font-bold text-white">Energy Calculation</h1>
            </div>
            <Dashboard {...props} />
        </div>
    );
}
