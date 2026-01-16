
import { configureStore } from "@reduxjs/toolkit";

export function setupApiStore(api: any) {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (gDM) => gDM().concat(api.middleware),
  });

  return store;
}
