import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/post-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["posts"],
};

const rootReducer = combineReducers({
  posts: postsReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
