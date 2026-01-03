import { useMemo } from "react";
import GlobalControls from "./GlobalControls";
import KPICards from "./KPICards";
import LiveSnapshot from "./LiveSnapshot";
import EnergyChart from "./EnergyChart";
import CostChart from "./CostChart";

export default function Dashboard({
    homes,
    selectedHome,
    onHomeChange,
    start,
    end,
    onStartChange,
    onEndChange,
    liveData,
    dailyData,
    costData,
    loading,
    error
}) {

    // Calculate KPI Summaries
    const currentPower = useMemo(() => {
        if (!liveData) return 0;
        return liveData.reduce((sum, item) => sum + (Number(item.power_w) || 0), 0);
    }, [liveData]);

    const totalEnergy = useMemo(() => {
        if (!dailyData) return 0;
        return dailyData.reduce((sum, item) => sum + (Number(item.energy_kwh) || 0), 0);
    }, [dailyData]);

    const totalCost = useMemo(() => {
        if (!costData) return 0;
        // Assuming costData has cost_gbp. If not, this might need adjustment based on API response confirmation.
        // Based on previous Overview.jsx, it summed daily cost.
        // Here we use costData (peak/off-peak). 
        return costData.reduce((sum, item) => sum + (Number(item.cost_gbp) || 0), 0);
    }, [costData]);


    if (error) {
        return (
            <div className="flex h-screen items-center justify-center p-8 text-red-500 bg-[var(--bg-primary)]">
                <div className="p-6 border border-red-500/30 bg-red-500/10 rounded-xl max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-12">
            {/* Top Bar / Header Area */}
            <div className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-color)] to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <span className="font-bold text-white text-xl">W</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">WattWise</h1>
                        </div>

                        <GlobalControls
                            homes={homes}
                            selectedHome={selectedHome}
                            onHomeChange={onHomeChange}
                            start={start}
                            end={end}
                            onStartChange={onStartChange}
                            onEndChange={onEndChange}
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* KPI Section */}
                <section>
                    <KPICards
                        currentPower={currentPower}
                        totalEnergy={totalEnergy}
                        totalCost={totalCost}
                    />
                </section>

                {/* Charts Grid */}
                <section className="h-[400px]">
                    <EnergyChart data={dailyData} />
                </section>

                {/* Live Snapshot Section */}
                <section className="h-[500px]">
                    <LiveSnapshot appliances={liveData || []} />
                </section>
            </main>
        </div>
    );
}
