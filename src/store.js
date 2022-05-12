import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './slices/blog';

const reducer = {
  blogs: blogReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store;