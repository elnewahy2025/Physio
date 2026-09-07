// Type declarations for @vercel/express
declare module "@vercel/express" {
  import type { Application } from "express";

  function vercel(
    app: Application
  ): (req: unknown, res: unknown, next?: unknown) => void;

  export { vercel };
}
