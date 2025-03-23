import {createSlice} from "@reduxjs/toolkit";
import {initialState} from "./initialState.ts";
import {ResearchFormData} from "../../types/state.ts";
import {fetchResearches, fetchResearchById} from "./asyncThunks.ts";
import {
    deleteResearch,
    getWikipediaPage,
    getWikipediaTalkPage,
    saveResearch,
    searchWikipedia,
    updateResearch,
    uploadWikipediaThread
} from "./asyncThunks.ts";

export const researchSlice = createSlice({
    name: "research",
    initialState,
    reducers: {
        setResearchFormData: (state, action: PayloadAction<Partial<ResearchFormData>>) => {
            state.currentResearch = {...state.currentResearch, ...action.payload};
        },
        resetResearchForm: (state) => {
            state.currentResearch = initialState.currentResearch;
        }
    },
    extraReducers: (builder) => {
        // Fetch all researches
        builder
            .addCase(fetchResearches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResearches.fulfilled, (state, action) => {
                state.loading = false;
                state.researches = action.payload;
            })
            .addCase(fetchResearches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch researches";
            });

        // Fetch research by ID
        builder
            .addCase(fetchResearchById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResearchById.fulfilled, (state, action) => {
                state.loading = false;
                // Update current research form
                const {name, description, start_date, end_date, message_limit, file_name, anonymized} = action.payload;
                state.currentResearch = {
                    name,
                    description,
                    startDate: start_date || "",
                    endDate: end_date || "",
                    messageLimit: message_limit || 50,
                    fileName: file_name || "",
                    anonymize: anonymized
                };

                // Add to researches array if not already there
                if (!state.researches.some(r => r.id === action.payload.id)) {
                    state.researches.push(action.payload);
                }
            })
            .addCase(fetchResearchById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch research";
            });

        // Save research
        builder
            .addCase(saveResearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveResearch.fulfilled, (state, action) => {
                state.loading = false;
                state.researches.push(action.payload);
            })
            .addCase(saveResearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to save research";
            });

        // Update research
        builder
            .addCase(updateResearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateResearch.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.researches.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.researches[index] = action.payload;
                }
            })
            .addCase(updateResearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update research";
            });

        // Delete research
        builder
            .addCase(deleteResearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteResearch.fulfilled, (state, action) => {
                state.loading = false;
                state.researches = state.researches.filter(r => r.id !== action.payload);
                if (state.currentResearch.name && state.researches.length > 0) {
                    state.currentResearch = initialState.currentResearch;
                }
            })
            .addCase(deleteResearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete research";
            });

        // Wikipedia search
        builder
            .addCase(searchWikipedia.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchWikipedia.fulfilled, (state) => {
                state.loading = false;
                // Results handled by component
            })
            .addCase(searchWikipedia.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Wikipedia search failed";
            });

        // Wikipedia page content
        builder
            .addCase(getWikipediaPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWikipediaPage.fulfilled, (state) => {
                state.loading = false;
                // Page content handled by component
            })
            .addCase(getWikipediaPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get Wikipedia page";
            });

        // Wikipedia talk page
        builder
            .addCase(getWikipediaTalkPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWikipediaTalkPage.fulfilled, (state) => {
                state.loading = false;
                // Talk page content handled by component
            })
            .addCase(getWikipediaTalkPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get Wikipedia talk page";
            });

        // Upload Wikipedia thread
        builder
            .addCase(uploadWikipediaThread.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadWikipediaThread.fulfilled, (state) => {
                state.loading = false;
                // Thread ID handled by component
            })
            .addCase(uploadWikipediaThread.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to upload Wikipedia thread";
            });
    }
});