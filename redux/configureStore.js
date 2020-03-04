import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { persistStore, persistCombineReducers } from "redux-persist";
// import storage from "redux-persist/es/storage";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { products } from "./products";

const config = {
  key: "root",
  storage,
  debug: false
};

export const ConfigureStore = () => {
  const store = createStore(
    persistCombineReducers(config, { products }),
    applyMiddleware(thunk)
  );

  const persistor = persistStore(store);
  return { persistor, store };
};
