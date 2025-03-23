// Initial state
import {NetworkState} from "../../types/state.ts";

export const initialState: NetworkState = {
    networkData: null,
    originalData: null,
    analysisParams: {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        messageLimit: 50,
        limitType: "first",
        minMessageLength: 10,
        maxMessageLength: 100,
        keywords: "",
        usernameFilter: "",
        minMessages: "",
        maxMessages: "",
        activeUsers: "",
        selectedUsers: "",
        isAnonymized: false,
    },
    selectedMetric: null,
    strongConnectionsActive: false,
    loading: false,
    error: null,
};