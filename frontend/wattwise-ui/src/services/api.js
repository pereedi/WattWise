const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function apiGet(path, params = {}) {
    const url = new URL(API_BASE + path);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });

    const token = localStorage.getItem("wattwise_token");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        if (res.status === 401) {
            localStorage.removeItem("wattwise_token");
            window.location.reload();
        }
        throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
}

export const login = async (user_id, password) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, password })
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    localStorage.setItem("wattwise_token", data.token);
    return data;
};

export const fetchHomes = () => apiGet("/api/v1/me/home").then(data => [data]); // Wrap in array to match previous UI expectation

export const fetchApplianceSnapshot = () =>
    apiGet("/api/v1/live/home");

export const fetchDailyEnergy = (start, end) =>
    apiGet("/api/v1/timeseries/home-daily", { start, end });

export const fetchCostSummary = (start, end) =>
    apiGet("/api/v1/cost/peak-offpeak-daily", { start, end });

export const fetchAppliances = () => apiGet("/api/v1/appliances");
export const fetchApplianceDaily = (appliance_id, start, end) =>
    apiGet("/api/v1/timeseries/appliance-daily", { appliance_id, start, end });
export const fetchAllAppliancesDaily = (start, end) =>
    apiGet("/api/v1/timeseries/all-appliances-daily", { start, end });
