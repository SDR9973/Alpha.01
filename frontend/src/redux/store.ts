// src/redux/store.ts (previously store.js)
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add more reducers as we create them
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export default store;