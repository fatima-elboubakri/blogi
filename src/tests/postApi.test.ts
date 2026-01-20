import { describe, expect, it } from "vitest";
import { postsApi } from "../services/Post/postApi";
import { setupApiStore } from "./setup/setupApiStore";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const store = setupApiStore(postsApi);

baseQuery: fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
})

describe("postsApi", () => {
  it("gets all posts",{ skip: false }, async () => {
    const result = await store.dispatch(
      postsApi.endpoints.getPosts.initiate()
    );
    expect(result.data?.length).toBe(2);
  });

  it("gets post by id",{ skip: false }, async () => {
    const result = await store.dispatch(
      postsApi.endpoints.getPostById.initiate(1)
    );
    expect(result.data?.id).toBe(1);
  });

  it("adds a post",{ skip: false }, async () => {
    const payload = { userId: 1, title: "New", body: "Created" };
    const result = await store.dispatch(
      postsApi.endpoints.addPost.initiate(payload)
    );
    expect(result.data?.id).toBe(101);
  });

  it("updates a post",{ skip: false }, async () => {
    const payload = { id: 1, title: "Updated", body: "Body", userId: 1 };
    const result = await store.dispatch(
      postsApi.endpoints.updatePost.initiate(payload)
    );
    expect(result.data.id).toBe(1);
  });

  it("deletes a post", { skip: false },async () => {
    const result = await store.dispatch(
      postsApi.endpoints.deletePost.initiate(1)
    );

    expect(result.data?.success).toBe(true);
  });
});
