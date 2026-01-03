import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import EnergyCalculation from "./pages/EnergyCalculation";
import { fetchHomes, fetchApplianceSnapshot, fetchDailyEnergy, fetchCostSummary, fetchAllAppliancesDaily } from "./services/api";
import { subDays, format } from "date-fns";

export default function App() {
  const [activePage, setActivePage] = useState("overview");
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

  useEffect(() => {
    fetchHomes()
      .then((data) => {
        setHomes(data);
        if (data.length > 0) setSelectedHome(data[0].home_id);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedHome) return;

    setLoading(true);
    setError("");

    Promise.all([
      fetchApplianceSnapshot(selectedHome),
      fetchDailyEnergy(selectedHome, start, end),
      fetchCostSummary(selectedHome, start, end),
      fetchAllAppliancesDaily(selectedHome, start, end)
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

  }, [selectedHome, start, end]);

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
    error
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {activePage === "overview" ? (
        <Overview {...commonProps} />
      ) : (
        <EnergyCalculation {...commonProps} />
      )}
    </Layout>
  );
}
