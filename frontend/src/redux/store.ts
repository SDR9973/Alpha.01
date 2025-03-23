// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import fileReducer from "./file/fileSlice";
import networkReducer from "./network/networkSlice";
import researchReducer from "./research/asyncThunks";
import uiReducer from "./ui/uiSlice";
import wikipediaReducer from "./wikipedia/wikipediaSlice";

// Create store configuration that's CSP-friendly
export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    network: networkReducer,
    research: researchReducer,
    ui: uiReducer,
    wikipedia: wikipediaReducer,
  },
  // Use serializableCheck: false since it can cause issues with CSP
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // Disable immutableCheck if it's causing CSP issues
      immutableCheck: false,
    }),
  // This should be fine with CSP
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;