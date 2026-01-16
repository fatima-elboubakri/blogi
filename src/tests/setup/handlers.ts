
import { http, HttpResponse } from "msw";

export const handlers = [
  
http.get("https://jsonplaceholder.typicode.com/posts", () => {
    return HttpResponse.json([
      { id: 1, userId: 1, title: "Hello", body: "World" },
      { id: 2, userId: 1, title: "Test", body: "More" },
    ]);
  }),


  http.get("https://jsonplaceholder.typicode.com/posts/1", () => {
    
    return  HttpResponse.json({ id: 1, userId: 1, title: "Hello", body: "World" })
    
  }),

  http.post("https://jsonplaceholder.typicode.com/posts", async () => {
    const body = await HttpResponse.json();
    return HttpResponse.json({ id: 101, ...body });
  }),

  http.put("https://jsonplaceholder.typicode.com/posts/1", async () => {
    const body = await HttpResponse.json();
    return HttpResponse.json({ id: 1, ...body });
  }),

  http.delete("https://jsonplaceholder.typicode.com/posts/1", () => {
    
    return HttpResponse.json({ success: true, id: 1 });
  }),
];
