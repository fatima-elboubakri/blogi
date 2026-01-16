
import { configureStore} from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { batchedSubscribe } from 'redux-batched-subscribe'
import debounce from 'lodash/debounce'            

import postReducer from '../../services/Post/postSlice'
import { postsApi } from '../../services/Post/postApi'

const reducer = {
  posts: postReducer,
  [postsApi.reducerPath]: postsApi.reducer,
}

const preloadedState = undefined

const debounceNotify = debounce((notify: () => void) => notify(), 16)

// Disable logger in production for perf/clean logs
const isProd = import.meta.env.NODE_ENV === 'production'

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    isProd ? getDefaultMiddleware() : getDefaultMiddleware().concat(postsApi.middleware,logger),
  devTools: !isProd,
  preloadedState,
  // for perf eviter too many rerendring
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({
      autoBatch: true, 
    }).concat(batchedSubscribe(debounceNotify)),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
