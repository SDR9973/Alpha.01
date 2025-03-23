// src/redux/user/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {RootState} from "../../types/state.ts";


// Define types for our state
interface UserState {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// User type
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

// API response types
interface TokenResponse {
  access_token: string;
  user: User;
  token_type: string;
}

// Define a type for the login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// API URL
const API_URL = "http://localhost:8000";

export const loginUser = createAsyncThunk<
  TokenResponse,
  LoginCredentials
>("user/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.detail || "Login failed");
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(message);
  }
});

// Initial state
const initialState: UserState = {
  currentUser: null,
  token: null,
  loading: false,
  error: null,
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TokenResponse>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.access_token;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    deleteUser: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setUser, logoutUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUser = (state: RootState) => state.user.currentUser;
export const selectToken = (state: RootState) => state.user.token;
export const selectIsLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;