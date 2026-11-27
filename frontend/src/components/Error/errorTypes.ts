import { ReactNode } from "react";

export type FallbackRender = (reset: () => void) => ReactNode;

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode | FallbackRender;
  resetKeys?: ReadonlyArray<unknown>;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};