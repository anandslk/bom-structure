import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createMutationQuery, headers } from "./config";
import { env } from "src/utils/env";
import { ISigninArgs, ISignupArgs } from "./types";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: env.API_URL,
    prepareHeaders: headers,
  }),

  endpoints: (builder) => ({
    signin: builder.mutation(createMutationQuery<ISigninArgs>("/signin")),
    signup: builder.mutation<void, ISignupArgs>(createMutationQuery("/signup")),
  }),
});

export const { useSignupMutation, useSigninMutation } = apiSlice;

export const {} = apiSlice;
