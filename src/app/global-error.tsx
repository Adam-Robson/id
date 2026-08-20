"use client";

import { useEffect } from "react";

/**
 * Last resort: replaces the root layout entirely, so it can't rely on the
 * providers, fonts or stylesheets set up there. Everything it needs is
 * inline on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f3e7",
          color: "#36302a",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <main>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
            LE FOG is temporarily unavailable
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "#7d7466" }}>
            Something went wrong loading the site. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              font: "inherit",
              padding: "0.55rem 1.4rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(39, 35, 32, 0.2)",
              background: "transparent",
              color: "#52799a",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
