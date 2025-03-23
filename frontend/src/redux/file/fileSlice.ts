// src/redux/file/fileSlice.ts
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {initialState} from "./initialState.ts";
import {Constants} from "./constants.ts";

// Async thunks
export const uploadFile = createAsyncThunk(
  "file/upload",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${Constants}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

export const deleteFile = createAsyncThunk(
  "file/delete",
  async (filename: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${Constants}/delete/${filename}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

export const listFiles = createAsyncThunk(
  "file/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Constants}/files`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to list files");
    }
  }
);

export const analyzeNetwork = createAsyncThunk(
  "file/analyzeNetwork",
  async ({ filename, params }: { filename: string; params: any }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const response = await axios.get(
        `${Constants}/analyze/network/${filename}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Network analysis failed");
    }
  }
);

// Create slice
const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    clearFileState: (state) => {
      state.uploadedFile = null;
      state.error = null;
    },
    setUploadedFile: (state, action) => {
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
        state.uploadedFile = action.payload.filename;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      });
  },
});

export const { clearFileState, setUploadedFile } = fileSlice.actions;
export default fileSlice.reducer;