"use client"
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "@/redux/RootReducer";
import {Provider} from "react-redux"
import {SessionProvider } from "next-auth/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';


const persistorConfig={
  key:"root",
  storage,
  whitelist:["cart"]
}

const persistedReducer=persistReducer(persistorConfig,rootReducer)



const store=configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
     serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  })
})

const persistor=persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default function Providers({children}:Readonly<{children:React.ReactNode}>){
  const [queryClient] = useState(() => new QueryClient());             
  return (
                       <QueryClientProvider client={queryClient}>
                       <SessionProvider refetchInterval={5*60}>
                       <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}></PersistGate>
                       {children}
                       </Provider>
                       </SessionProvider>
                       <ReactQueryDevtools initialIsOpen={false} />
                       </QueryClientProvider>
               );
}