// src/redux/ui/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { UIState } from "../../types/state";

// Initial state
const initialState: UIState = {
  showFilters: true,
  showMetrics: true,
  showNetworkStats: false,
  showDensity: false,
  showDiameter: false,
  sidebarOpen: false
};

// Slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    toggleMetrics: (state) => {
      state.showMetrics = !state.showMetrics;
    },
    toggleNetworkStats: (state) => {
      state.showNetworkStats = !state.showNetworkStats;
    },
    toggleDensity: (state) => {
      state.showDensity = !state.showDensity;
    },
    toggleDiameter: (state) => {
      state.showDiameter = !state.showDiameter;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    }
  }
});

export const {
  toggleFilters,
  toggleMetrics,
  toggleNetworkStats,
  toggleDensity,
  toggleDiameter,
  toggleSidebar,
  setSidebarOpen
} = uiSlice.actions;

export default uiSlice.reducer;