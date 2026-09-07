import { createApp } from "./app.js";
import { vercel } from "@vercel/express";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

// Export the Express app wrapped for Vercel serverless
// Vercel will handle the serverless invocation
const handler = vercel(app);

export default handler;

// For local development, start the server
const server = app.listen(port, () => {
  console.log(`Physio API listening on port ${port}`);
});

// Export server for testing
export { server, app };
