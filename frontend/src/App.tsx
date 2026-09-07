import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Home />
        </Layout>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
