import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement, useState } from "react";

type AppQueryClientProviderProps = {
  children: ReactElement
}

export function AppQueryClientProvider({children}: AppQueryClientProviderProps) {
  const [ queryClient ] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}