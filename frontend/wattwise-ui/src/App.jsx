import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import EnergyCalculation from "./pages/EnergyCalculation";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import { fetchHomes, fetchApplianceSnapshot, fetchDailyEnergy, fetchCostSummary, fetchAllAppliancesDaily } from "./services/api";
import { subDays, format } from "date-fns";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("wattwise_token"));
  const [activePage, setActivePage] = useState("welcome");
  const [homes, setHomes] = useState([]);
  const [selectedHome, setSelectedHome] = useState("");
  const [start, setStart] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [end, setEnd] = useState(format(new Date(), "yyyy-MM-dd"));

  const [liveData, setLiveData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [allAppliancesData, setAllAppliancesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActivePage("welcome");
  };

  const handleLogout = () => {
    localStorage.removeItem("wattwise_token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchHomes()
      .then((data) => {
        setHomes(data);
        if (data.length > 0) setSelectedHome(data[0].home_id);
      })
      .catch((e) => setError(e.message));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedHome || !isAuthenticated) return;

    setLoading(true);
    setError("");

    Promise.all([
      fetchApplianceSnapshot(),
      fetchDailyEnergy(start, end),
      fetchCostSummary(start, end),
      fetchAllAppliancesDaily(start, end)
    ])
      .then(([live, daily, cost, allApps]) => {
        setLiveData(live);
        setDailyData(daily);
        setCostData(cost);
        setAllAppliancesData(allApps);
      })
      .catch(e => {
        console.error("Fetch Error:", e);
        setError(e.message);
      })
      .finally(() => setLoading(false));

  }, [selectedHome, start, end, isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const commonProps = {
    homes,
    selectedHome,
    onHomeChange: setSelectedHome,
    start,
    end,
    onStartChange: setStart,
    onEndChange: setEnd,
    liveData,
    dailyData,
    costData,
    allAppliancesData,
    loading,
    error,
    onLogout: handleLogout,
    setActivePage: setActivePage
  };

  if (activePage === "welcome") {
    return <Welcome onContinue={() => setActivePage("overview")} />;
  }

  return (
    <Layout>
      {activePage === "overview" ? (
        <Overview {...commonProps} />
      ) : (
        <EnergyCalculation {...commonProps} />
      )}
    </Layout>
  );
}
