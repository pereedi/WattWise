const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function apiGet(path, params = {}) {
    const url = new URL(API_BASE + path);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });

    const res = await fetch(url.toString());
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
}

export const fetchHomes = () => apiGet("/api/v1/homes");

export const fetchApplianceSnapshot = (home_id) =>
    apiGet("/api/v1/live/home", { home_id });

export const fetchDailyEnergy = (home_id, start, end) =>
    apiGet("/api/v1/timeseries/home-daily", { home_id, start, end });

export const fetchCostSummary = (home_id, start, end) =>
    apiGet("/api/v1/cost/peak-offpeak-daily", { home_id, start, end });

// Keeping these for completeness if needed later, though not explicitly in plan's "NEW" list they are useful.
export const fetchAppliances = () => apiGet("/api/v1/appliances");
export const fetchApplianceDaily = (home_id, appliance_id, start, end) =>
    apiGet("/api/v1/timeseries/appliance-daily", { home_id, appliance_id, start, end });
export const fetchAllAppliancesDaily = (home_id, start, end) =>
    apiGet("/api/v1/timeseries/all-appliances-daily", { home_id, start, end });
