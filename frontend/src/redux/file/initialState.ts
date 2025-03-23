// Initial state
import {FileState} from "../../types/state.ts";

export const initialState: FileState = {
    uploadedFile: null,
    files: [],
    loading: false,
    error: null,
};