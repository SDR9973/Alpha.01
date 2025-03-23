// src/redux/network/networkSlice.ts
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {analyzeNetwork} from "../file/fileSlice";
import {initialState} from "./initialState.ts";
import {Constants} from "./constants.ts";

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNetworkFilter: (state, action: PayloadAction<string>) => {
      state.analysisParams.usernameFilter = action.payload;
    },
    setSelectedMetric: (state, action: PayloadAction<string | null>) => {
      state.selectedMetric = action.payload;
    },
    toggleStrongConnections: (state) => {
      if (!state.networkData || !state.originalData) return;

      if (state.strongConnectionsActive) {
        // Restore original data
        state.networkData = state.originalData;
        state.strongConnectionsActive = false;
      } else {
        // Filter for strong connections
        const filteredNodes = state.networkData.nodes.filter(
          (node) => node.betweenness >= Constants
        );

        const filteredLinks = state.networkData.links.filter(
          (link) => {
            const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
            const targetId = typeof link.target === 'string' ? link.target : link.target.id;

            return filteredNodes.some((node) => node.id === sourceId) &&
                  filteredNodes.some((node) => node.id === targetId);
          }
        );

        state.networkData = {
          nodes: filteredNodes,
          links: filteredLinks,
        };
        state.strongConnectionsActive = true;
      }
    },
    updateAnalysisParams: (state, action: PayloadAction<Partial<typeof state.analysisParams>>) => {
      state.analysisParams = { ...state.analysisParams, ...action.payload };
    },
    resetNetworkData: (state) => {
      state.networkData = null;
      state.originalData = null;
      state.selectedMetric = null;
      state.strongConnectionsActive = false;
    },
  },
  extraReducers: (builder) => {
    // Handle network analysis results
    builder
      .addCase(analyzeNetwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeNetwork.fulfilled, (state, action) => {
        state.loading = false;
        state.networkData = action.payload;
        state.originalData = action.payload; // Keep a copy of original data
        state.strongConnectionsActive = false;
      })
      .addCase(analyzeNetwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setNetworkFilter,
  setSelectedMetric,
  toggleStrongConnections,
  updateAnalysisParams,
  resetNetworkData,
} = networkSlice.actions;

export default networkSlice.reducer;