import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";
import selectReducer from "../slice/SelectUser";
import { persistStore, persistReducer, 
         FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Config for what to persist
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  selectedUser : selectReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ FIXED: added middleware to ignore non-serializable warning
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);
export default store;
