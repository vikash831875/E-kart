import userSlice from "./userSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice"

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// ✅ CUSTOM STORAGE (fix)
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"], // ✅ best practice
};

const rootReducer = combineReducers({
  user: userSlice,
  product:productSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER, PERSIST],
      },
    }),
});

export const persistor = persistStore(store);
export default store;