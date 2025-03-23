// src/redux/research/asyncThunks.ts
import {createAsyncThunk} from "@reduxjs/toolkit";
import {ResearchFormData} from "../../types/state";
import {ResearchResponse, WikipediaPage, WikipediaSearchResult} from "../../types/api";
import {apiService} from "../../services/api";
import {researchSlice} from "./researchSlice.ts";


export const fetchResearches = createAsyncThunk<
    ResearchResponse[],
    void,
    { rejectValue: string }
>("research/fetchAll", async (_, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.getResearches(user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch researches");
    }
});
export const fetchResearchById = createAsyncThunk<
    ResearchResponse,
    string,
    { rejectValue: string }
>("research/fetchById", async (researchId, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.getResearchById(researchId, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch research");
    }
});


export const saveResearch = createAsyncThunk<
    ResearchResponse,
    ResearchFormData,
    { rejectValue: string }
>("research/save", async (researchData, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.saveResearch(researchData, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to save research");
    }
});

export const updateResearch = createAsyncThunk<
    ResearchResponse,
    { id: string; data: Partial<ResearchFormData> },
    { rejectValue: string }
>("research/update", async ({id, data}, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.updateResearch(id, data, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to update research");
    }
})

export const deleteResearch = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("research/delete", async (researchId, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        await apiService.deleteResearch(researchId, user.token);
        return researchId;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to delete research");
    }
});

// Wikipedia integration
export const searchWikipedia = createAsyncThunk<
    WikipediaSearchResult[],
    string,
    { rejectValue: string }
>("research/asyncThunks", async (query, {rejectWithValue}) => {
    try {
        return await apiService.searchWikipedia(query);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to search Wikipedia");
    }
});

export const getWikipediaPage = createAsyncThunk<
    WikipediaPage,
    string,
    { rejectValue: string }
>("research/getWikipediaPage", async (title, {rejectWithValue}) => {
    try {
        return await apiService.getWikipediaPage(title);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to get Wikipedia page");
    }
});

export const getWikipediaTalkPage = createAsyncThunk<
    WikipediaPage,
    string,
    { rejectValue: string }
>("research/getWikipediaTalkPage", async (title, {rejectWithValue}) => {
    try {
        return await apiService.getWikipediaTalkPage(title);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to get Wikipedia talk page");
    }
});

export const uploadWikipediaThread = createAsyncThunk<
    { thread_id: string },
    { title: string; description: string },
    { rejectValue: string }
>("research/uploadWikipediaThread", async (threadData, {getState, rejectWithValue}) => {
    try {
        const {user} = getState() as { user: { token: string | null } };

        if (!user.token) {
            return rejectWithValue("Authentication required");
        }

        return await apiService.uploadWikipediaThread(threadData, user.token);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to upload Wikipedia thread");
    }
});

export const {setResearchFormData, resetResearchForm} = researchSlice.actions;
export default researchSlice.reducer;