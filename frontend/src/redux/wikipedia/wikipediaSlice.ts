import {createSlice} from "@reduxjs/toolkit";
import {initialState} from "./initialState.ts";
import {getWikipediaPage, getWikipediaTalkPage, uploadWikipediaThread, searchWikipedia} from "./asyncThunks.ts";

// Slice
const wikipediaSlice = createSlice({
    name: "wikipedia",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        clearSelectedPages: (state) => {
            state.selectedPage = null;
            state.selectedTalkPage = null;
        }
    },
    extraReducers: (builder) => {
        // Search Wikipedia
        builder
            .addCase(searchWikipedia.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchWikipedia.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchWikipedia.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Search failed";
            });

        // Get Wikipedia page
        builder
            .addCase(getWikipediaPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWikipediaPage.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPage = action.payload;
            })
            .addCase(getWikipediaPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get page";
            });

        // Get Wikipedia talk page
        builder
            .addCase(getWikipediaTalkPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWikipediaTalkPage.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTalkPage = action.payload;
            })
            .addCase(getWikipediaTalkPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get talk page";
            });

        // Upload Wikipedia thread
        builder
            .addCase(uploadWikipediaThread.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadWikipediaThread.fulfilled, (state) => {
                state.loading = false;
                // We don't set currentThread here as we'd need to fetch it separately
            })
            .addCase(uploadWikipediaThread.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to upload thread";
            });
    }
});

export const {clearSearchResults, clearSelectedPages} = wikipediaSlice.actions;
export default wikipediaSlice.reducer;