import { Component, type ErrorInfo } from "react";
import { ErrorFallback } from "./ErrorFallback";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./errorTypes";

const areResetKeysEqual = (
  prevKeys: ReadonlyArray<unknown> | undefined,
  nextKeys: ReadonlyArray<unknown> | undefined,
) => {
  if (prevKeys === nextKeys) return true;
  if (!prevKeys || !nextKeys || prevKeys.length !== nextKeys.length) return false;
  return prevKeys.every((key, index) => Object.is(key, nextKeys.at(index)));
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Unhandled render error:", error, errorInfo.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (!this.state.hasError) return;
    if (!areResetKeysEqual(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { fallback } = this.props;
    if (!fallback) return <ErrorFallback reset={this.reset} />;
    if (typeof fallback === "function") return fallback(this.reset);
    return fallback;
  }
}

export default ErrorBoundary;
