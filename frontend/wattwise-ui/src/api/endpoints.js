import { apiGet } from "./client";

export const getHomes = () => apiGet("/api/v1/homes");
export const getAppliances = () => apiGet("/api/v1/appliances");

export const getLiveHome = (home_id) =>
  apiGet("/api/v1/live/home", { home_id });

export const getHomeDaily = (home_id, start, end) =>
  apiGet("/api/v1/timeseries/home-daily", { home_id, start, end });

export const getApplianceDaily = (home_id, appliance_id, start, end) =>
  apiGet("/api/v1/timeseries/appliance-daily", { home_id, appliance_id, start, end });

export const getPeakOffpeakDaily = (home_id, start, end) =>
  apiGet("/api/v1/cost/peak-offpeak-daily", { home_id, start, end });
