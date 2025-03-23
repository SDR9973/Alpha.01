// Async thunks
import {createAsyncThunk} from "@reduxjs/toolkit";
import {WikipediaPage, WikipediaSearchResult} from "../../types/api.ts";
import {apiService} from "../../services/api.ts"

export const searchWikipedia = createAsyncThunk(
    "wikipedia/search",
    async (query: string, {rejectWithValue}) => {
        try {
            if (query.length < 2) return [];
            console.log(query)
            return await apiService.searchWikipedia(query) as WikipediaSearchResult;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Search failed");
        }
    }
);

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
export const uploadWikipediaThread = createAsyncThunk<
    { thread_id: string },
    { title: string; description: string },
    { rejectValue: string }
>("wikipedia/uploadThread", async (threadData, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.uploadWikipediaThread({
            wikipedia_title: threadData.title,
            description: threadData.description
        }, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to upload thread");
    }
});