
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post } from './postTypes';


export const postsApi = createApi({
  reducerPath: 'postsApi', // nom du slice RTK Query
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // prepareHeaders: (headers) => { /* ex: auth token */ return headers; }
  }),
  tagTypes: ['Posts'], // pour l'invalidation du cache
  endpoints: (builder) => ({
    // READ: tous les posts
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Posts' as const, id: p.id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    // READ: un post par id
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, _error, id) => [{ type: 'Posts', id }],
    }),

    // CREATE
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),

    // UPDATE
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT', // ou PATCH selon l’API
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Posts', id }],
    }),

    // DELETE
    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
  }),
});

// Hooks auto-générés par RTK Query
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
