// src/redux/wikipedia/asyncThunks.ts
import {createAsyncThunk} from "@reduxjs/toolkit";
import {apiService} from "../../services/api";
import {
    WikipediaSearchResult,
    WikipediaPage,
    NetworkAnalysisResponse,
    WikipediaThread,

} from "../../types/api";
import {AnalysisParams} from "../../types/state";

// Search Wikipedia
export const searchWikipedia = createAsyncThunk<
    WikipediaSearchResult[],
    string,
    { rejectValue: string }
>("wikipedia/search", async (query, {rejectWithValue}) => {
    try {
        if (query.length < 2) return [];
        return await apiService.searchWikipedia(query);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Search failed");
    }
});

// Get Wikipedia page
export const getWikipediaPage = createAsyncThunk<
    WikipediaPage,
    string,
    { rejectValue: string }
>("wikipedia/getPage", async (title, {rejectWithValue}) => {
    try {
        return await apiService.getWikipediaPage(title);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to get page");
    }
});

// Get Wikipedia talk page
export const getWikipediaTalkPage = createAsyncThunk<
    WikipediaPage,
    string,
    { rejectValue: string }
>("wikipedia/getTalkPage", async (title, {rejectWithValue}) => {
    try {
        return await apiService.getWikipediaTalkPage(title);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to get talk page");
    }
});

// Upload Wikipedia thread
export const uploadWikipediaThread = createAsyncThunk<
    { thread_id: string },
    { title: string; description: string; researchId?: string },
    { rejectValue: string }
>("wikipedia/uploadThread", async (threadData, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.uploadWikipediaThread({
            wikipedia_title: threadData.title,
            description: threadData.description,
            research_id: threadData.researchId
        }, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to upload thread");
    }
});

// Get thread by ID
export const getWikipediaThreadById = createAsyncThunk<
    WikipediaThread,
    string,
    { rejectValue: string }
>("wikipedia/getThreadById", async (threadId, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        // Get thread details
        const thread = await apiService.getWikipediaThreadById(threadId, user.token);

        // Get thread messages
        const messages = await apiService.getWikipediaThreadMessages(threadId, user.token);

        return {
            ...thread,
            messages
        };
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to get thread");
    }
});

// List threads
export const listWikipediaThreads = createAsyncThunk<
    WikipediaThread[],
    { researchId?: string },
    { rejectValue: string }
>("wikipedia/listThreads", async ({researchId}, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.listWikipediaThreads(researchId, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to list threads");
    }
});

// Analyze Wikipedia thread network
export const analyzeWikipediaThread = createAsyncThunk<
    NetworkAnalysisResponse,
    { threadId: string; params?: Partial<AnalysisParams> },
    { rejectValue: string }
>("wikipedia/analyzeNetwork", async ({threadId, params = {}}, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.analyzeWikipediaThread(threadId, params, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Network analysis failed");
    }
});

// Delete thread
export const deleteWikipediaThread = createAsyncThunk<
    boolean,
    string,
    { rejectValue: string }
>("wikipedia/deleteThread", async (threadId, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        await apiService.deleteWikipediaThread(threadId, user.token);
        return true;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to delete thread");
    }
});