// Initial state
import {ResearchState} from "../../types/state.ts";

export const initialState: ResearchState = {
    researches: [],
    currentResearch: {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        messageLimit: 50,
        fileName: "",
        anonymize: false
    },
    loading: false,
    error: null
};