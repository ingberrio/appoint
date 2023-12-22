import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => `user/${id}`,
        }),
    }),
});

export const { useGetUserQuery } = apiSlice;