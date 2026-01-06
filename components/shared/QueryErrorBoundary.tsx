"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type QueryErrorBoundaryProps = {
  children: ReactNode;
};

type QueryErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class QueryErrorBoundary extends Component<
  QueryErrorBoundaryProps,
  QueryErrorBoundaryState
> {
  constructor(props: QueryErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): QueryErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Query Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive">
          {t("error.something_went_wrong")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || t("error.unknown_error")}
        </p>
      </div>
      <Button onClick={() => window.location.reload()} variant="outline">
        {t("error.retry")}
      </Button>
    </div>
  );
}
