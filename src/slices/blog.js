import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BlogDataService from "../services/BlogService";

const initialState = [];

export const createBlog = createAsyncThunk(
  "blogs/create",
  async ({ title, description }) => {
    const res = await BlogDataService.create({ title, description });
    return res.data;
  }
);

export const retrieveBlog = createAsyncThunk(
  "blogs/retrieve",
  async () => {
    const res = await BlogDataService.getAll();
    return res.data;
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, data }) => {
    const res = await BlogDataService.update(id, data);
    return res.data;
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async ({ id }) => {
    await BlogDataService.delete(id);
    return { id };
  }
);

export const deleteAllBlogs = createAsyncThunk(
  "blogs/deleteAll",
  async () => {
    const res = await BlogDataService.deleteAll();
    return res.data;
  }
);

export const findBlogsByTitle = createAsyncThunk(
  "blogs/findByTitle",
  async ({ title }) => {
    const res = await BlogDataService.findByTitle(title);
    return res.data;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  extraReducers: {
    [createBlog.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [retrieveBlog.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [updateBlog.fulfilled]: (state, action) => {
      const index = state.findIndex(blog => blog.id === action.payload.id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [deleteBlog.fulfilled]: (state, action) => {
      let index = state.findIndex(({ id }) => id === action.payload.id);
      state.splice(index, 1);
    },
    [deleteAllBlogs.fulfilled]: (state, action) => {
      return [];
    },
    [findBlogsByTitle.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = blogSlice;
export default reducer;
