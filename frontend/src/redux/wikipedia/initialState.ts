// Initial state
import {WikipediaState} from "../../types/state.ts";

export const initialState: WikipediaState = {
    searchResults: [],
    selectedPage: null,
    selectedTalkPage: null,
    threads: [],
    currentThread: null,
    loading: false,
    error: null
};