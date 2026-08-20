import SiteHeader from "@/app/components/site-header";
import "@/app/components/interior-pages.css";
import "@/app/components/skeleton.css";

/**
 * Streams the page shell while the bucket listing is in flight, so a slow
 * R2 response shows the header and a placeholder shelf rather than a blank
 * document.
 */
export default function Loading() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main">
        <h1 className="page-eyebrow">Albums</h1>
        <div className="skeleton-shelf" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-block skeleton-cover" />
              <div className="skeleton-block skeleton-line skeleton-line--title" />
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line skeleton-line--short" />
            </div>
          ))}
        </div>
        <p className="skeleton-status" role="status">
          Loading albums…
        </p>
      </main>
    </div>
  );
}
