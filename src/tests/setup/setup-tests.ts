
import "@testing-library/jest-dom";
import { afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server";

//  Start MSW before all tests
beforeAll(() => server.listen());

//  Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

//  Stop server after all tests
afterAll(() => server.close());
