"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/components/layout/theme-provider";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

if (typeof window !== "undefined") {
  const origMeasure = performance.measure.bind(performance)
  performance.measure = (...args: Parameters<typeof performance.measure>) => {
    try { return origMeasure(...args) } catch { return undefined }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
