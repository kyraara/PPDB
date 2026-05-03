/**
 * SkeletonProfilJenjang.jsx
 * Skeleton loader untuk halaman profil jenjang.
 * Dipindahkan dari ProfilJenjangPage.jsx untuk menjaga file page tetap ringan.
 */

function SkeletonBlock({ className }) {
  return (
    <div className={`skeleton-pulse bg-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg ${className}`}>
      <div className="skeleton-shimmer" />
    </div>
  );
}

export default function SkeletonProfilJenjang() {
  return (
    <div className="pt-[90px] pb-20 min-h-screen">
      <div className="container max-w-[800px] mx-auto">
        <SkeletonBlock className="h-10 w-28 mb-8" />
        <div className="text-center mb-12">
          <SkeletonBlock className="h-24 w-24 mx-auto rounded-2xl mb-4" />
          <SkeletonBlock className="h-8 w-48 mx-auto mb-2" />
          <SkeletonBlock className="h-5 w-32 mx-auto mb-4" />
          <SkeletonBlock className="h-8 w-40 mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <SkeletonBlock className="h-40" />
          <SkeletonBlock className="h-40" />
        </div>
        <SkeletonBlock className="h-32 mb-4" />
        <SkeletonBlock className="h-32" />
      </div>
    </div>
  );
}
