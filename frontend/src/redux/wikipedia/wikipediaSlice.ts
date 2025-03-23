import {createSlice} from "@reduxjs/toolkit";
import initialState from "./initialState.ts"
import {
    searchWikipedia,
    getWikipediaPage,
    getWikipediaTalkPage,
    uploadWikipediaThread,
    getWikipediaThreadById,
    listWikipediaThreads,
    deleteWikipediaThread
} from "./asyncThunks";

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
        },
        clearCurrentThread: (state) => {
            state.currentThread = null;
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
            })
            .addCase(uploadWikipediaThread.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to upload thread";
            });

        // Get thread by ID
        builder
            .addCase(getWikipediaThreadById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWikipediaThreadById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentThread = action.payload;
            })
            .addCase(getWikipediaThreadById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get thread";
            });

        // List threads
        builder
            .addCase(listWikipediaThreads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listWikipediaThreads.fulfilled, (state, action) => {
                state.loading = false;
                state.threads = action.payload;
            })
            .addCase(listWikipediaThreads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to list threads";
            });

        // Delete thread
        builder
            .addCase(deleteWikipediaThread.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWikipediaThread.fulfilled, (state, action) => {
                state.loading = false;
                // Remove deleted thread from list
                if (state.currentThread && state.currentThread.thread_id === action.meta.arg) {
                    state.currentThread = null;
                }
                state.threads = state.threads.filter(thread => thread.thread_id !== action.meta.arg);
            })
            .addCase(deleteWikipediaThread.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete thread";
            });
    }
});


export const {clearSearchResults, clearSelectedPages, clearCurrentThread} = wikipediaSlice.actions;
export default wikipediaSlice.reducer;