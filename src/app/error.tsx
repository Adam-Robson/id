"use client";

import { useEffect } from "react";
import "@/app/components/interior-pages.css";
import "@/app/components/status-page.css";

/**
 * Catches render and data-fetching failures below the root layout — most
 * likely R2 being unreachable, since every page reads the catalog. Without
 * this the visitor gets Next's unstyled default error screen.
 */
export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error", error);
  }, [error]);

  return (
    <div className="page-wrapper page-wrapper--interior">
      <main className="interior-main status-page">
        <h1 className="page-eyebrow">Something broke</h1>
        <p className="page-body">
          This page didn't load. It's usually temporary — try again in a moment.
        </p>
        <p className="status-page-actions">
          <button type="button" onClick={reset}>
            Try again
          </button>
          <a href="/">Back home</a>
        </p>
        {error.digest && (
          <p className="status-page-digest">Reference: {error.digest}</p>
        )}
      </main>
    </div>
  );
}
