import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.ts";
import fileReducer from "./file/fileSlice";
import networkReducer from "./network/networkSlice.ts";
import researchReducer from "./research/asyncThunks.ts";
import uiReducer from "./ui/uiSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        file: fileReducer,
        network: networkReducer,
        research: researchReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;