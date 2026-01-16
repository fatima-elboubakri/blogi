import { describe, expect, it } from "vitest";
import { postsApi } from "../services/Post/postApi";
import { setupApiStore } from "./setup/setupApiStore";

const store = setupApiStore(postsApi);

describe("postsApi", () => {
  it("gets all posts", async () => {
    const result = await store.dispatch(
      postsApi.endpoints.getPosts.initiate()
    );
    expect(result.data?.length).toBe(2);
  });

  it("gets post by id", async () => {
    const result = await store.dispatch(
      postsApi.endpoints.getPostById.initiate(1)
    );
    expect(result.data?.id).toBe(1);
  });

  it("adds a post", async () => {
    const payload = { userId: 1, title: "New", body: "Created" };
    const result = await store.dispatch(
      postsApi.endpoints.addPost.initiate(payload)
    );
    expect(result.data?.id).toBe(101);
  });

  it("updates a post", async () => {
    const payload = { id: 1, title: "Updated", body: "Body", userId: 1 };
    const result = await store.dispatch(
      postsApi.endpoints.updatePost.initiate(payload)
    );
    expect(result.data?.title).toBe("Updated");
  });

  it("deletes a post", async () => {
    const result = await store.dispatch(
      postsApi.endpoints.deletePost.initiate(1)
    );
    expect(result.data?.success).toBe(true);
  });
});
