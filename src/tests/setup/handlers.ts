
import { http } from "msw";

export const handlers = [
  http.get("https://jsonplaceholder.typicode.com/posts", ({req, res, ctx}:any) => {
    console.log(req)
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, userId: 1, title: "Hello", body: "World" },
        { id: 2, userId: 1, title: "Test", body: "More" },
      ])
    );
  }),

  http.get("https://jsonplaceholder.typicode.com/posts/1", ({req, res, ctx}:any) => {
    console.log(req)
    return res(
      ctx.status(200),
      ctx.json({ id: 1, userId: 1, title: "Hello", body: "World" })
    );
  }),

  http.post("https://jsonplaceholder.typicode.com/posts", async ({req, res, ctx}:any) => {
    const body = await req.json();
    return res(ctx.status(201), ctx.json({ id: 101, ...body }));
  }),

  http.put("https://jsonplaceholder.typicode.com/posts/1", async ({req, res, ctx}:any) => {
    const body = await req.json();
    return res(ctx.status(200), ctx.json({ id: 1, ...body }));
  }),

  http.delete("https://jsonplaceholder.typicode.com/posts/1", ({req, res, ctx}:any) => {
    console.log(req)
    return res(ctx.status(200), ctx.json({ success: true, id: 1 }));
  }),
];
