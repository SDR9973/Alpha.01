// src/redux/file/fileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FileState } from "../../types/state";
import { apiService } from "../../services/api";

// Initial state
const initialState: FileState = {
  uploadedFile: null,
  files: [],
  loading: false,
  error: null,
};

// Async thunks
export const uploadFile = createAsyncThunk<
  string, // Return type (filename)
  File,   // Argument type
  { rejectValue: string }
>("file/upload", async (file, { getState, rejectWithValue }) => {
  try {
    const { user } = getState() as { user: { token: string | null } };

    if (!user.token) {
      return rejectWithValue("Authentication required");
    }

    const result = await apiService.uploadFile(file, user.token);
    return result.filename;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Upload failed");
  }
});

export const listFiles = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>("file/list", async (_, { getState, rejectWithValue }) => {
  try {
    const { user } = getState() as { user: { token: string | null } };

    if (!user.token) {
      return rejectWithValue("Authentication required");
    }

    const files = await apiService.listFiles(user.token);
    return files;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to list files");
  }
});

export const deleteFile = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("file/delete", async (filename, { getState, rejectWithValue }) => {
  try {
    const { user } = getState() as { user: { token: string | null } };

    if (!user.token) {
      return rejectWithValue("Authentication required");
    }

    await apiService.deleteFile(filename, user.token);
    return true;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete file");
  }
});

export const analyzeNetwork = createAsyncThunk<
  any, // Replace with your network response type
  { filename: string; params: Record<string, any> },
  { rejectValue: string }
>("file/analyzeNetwork", async ({ filename, params }, { getState, rejectWithValue }) => {
  try {
    const { user } = getState() as { user: { token: string | null } };

    if (!user.token) {
      return rejectWithValue("Authentication required");
    }

    const result = await apiService.analyzeNetwork(filename, params, user.token);
    return result;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Analysis failed");
  }
});

// Slice
const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    clearFileState: (state) => {
      state.uploadedFile = null;
      state.error = null;
    },
    setUploadedFile: (state, action: PayloadAction<string>) => {
      state.uploadedFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFile = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      });

    // List files
    builder
      .addCase(listFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(listFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to list files";
      });

    // Delete file
    builder
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state.loading = false;
        state.uploadedFile = null;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete file";
      });

    // Network analysis (result handled in networkSlice)
    builder
      .addCase(analyzeNetwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeNetwork.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(analyzeNetwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Analysis failed";
      });
  },
});

export const { clearFileState, setUploadedFile } = fileSlice.actions;
export default fileSlice.reducer;