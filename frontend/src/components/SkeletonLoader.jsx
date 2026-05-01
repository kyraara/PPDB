import { motion } from 'framer-motion';

/**
 * Reusable Skeleton Loader component.
 */

function SkeletonPulse({ style, className = '' }) {
  return (
    <div className={`skeleton-pulse rounded-md overflow-hidden relative bg-bg-tertiary dark:bg-dark-bg-tertiary ${className}`}
      style={style}>
      <div className="skeleton-shimmer" />
    </div>
  );
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius, style = {} }) {
  return (
    <SkeletonPulse style={{ width, height, borderRadius: borderRadius || '6px', ...style }} />
  );
}

export function SkeletonText({ lines = 3, gap = '0.6rem' }) {
  return (
    <div className="flex flex-col" style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height="0.85rem" />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 48 }) {
  return <Skeleton width={`${size}px`} height={`${size}px`} borderRadius="50%" />;
}

export function SkeletonCard({ height = '200px', children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-static p-6" style={{ minHeight: height }}>
      {children || (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SkeletonAvatar size={48} />
            <div className="flex-1">
              <Skeleton width="60%" height="1.1rem" />
              <Skeleton width="40%" height="0.75rem" style={{ marginTop: '0.5rem' }} />
            </div>
          </div>
          <SkeletonText lines={2} />
          <Skeleton width="100%" height="2.5rem" borderRadius="10px" />
        </div>
      )}
    </motion.div>
  );
}

/**
 * Beranda page skeleton
 */
export function BerandaSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <Skeleton width="220px" height="1.5rem" />
        <div className="flex gap-2 mt-2">
          <Skeleton width="60px" height="1.5rem" borderRadius="50px" />
          <Skeleton width="80px" height="0.85rem" style={{ marginTop: '0.25rem' }} />
        </div>
      </div>

      {/* Status Card */}
      <SkeletonCard height="180px">
        <div className="flex items-center gap-3 mb-5">
          <Skeleton width="48px" height="48px" borderRadius="14px" />
          <div className="flex-1">
            <Skeleton width="50%" height="1.2rem" />
            <Skeleton width="35%" height="0.7rem" style={{ marginTop: '0.4rem' }} />
          </div>
        </div>
        <SkeletonText lines={2} />
        <Skeleton width="100%" height="2.5rem" borderRadius="10px" style={{ marginTop: '1rem' }} />
      </SkeletonCard>

      {/* Timeline */}
      <div className="glass-card-static p-6">
        <Skeleton width="140px" height="0.75rem" style={{ marginBottom: '1.25rem' }} />
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`flex items-center ${i < 5 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center gap-1">
                <Skeleton width="28px" height="28px" borderRadius="50%" />
                <Skeleton width="35px" height="0.5rem" />
              </div>
              {i < 5 && <Skeleton width="100%" height="2px" style={{ margin: '0 0.35rem', marginBottom: '1.25rem' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card-static p-3 flex items-center gap-2.5">
            <Skeleton width="32px" height="32px" borderRadius="8px" />
            <div className="flex-1">
              <Skeleton width="60%" height="0.55rem" />
              <Skeleton width="80%" height="0.75rem" style={{ marginTop: '0.35rem' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="glass-card-static p-5">
        <Skeleton width="150px" height="0.75rem" style={{ marginBottom: '0.75rem' }} />
        <SkeletonText lines={2} gap="0.75rem" />
      </div>
    </div>
  );
}

/**
 * Form page skeleton
 */
export function FormSkeleton() {
  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton width="18px" height="18px" borderRadius="4px" />
        <Skeleton width="180px" height="1.1rem" />
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i}>
            <Skeleton width="120px" height="0.75rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="100%" height="2.75rem" borderRadius="10px" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton width="100px" height="0.75rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="100%" height="2.75rem" borderRadius="10px" />
          </div>
          <div>
            <Skeleton width="110px" height="0.75rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="100%" height="2.75rem" borderRadius="10px" />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Skeleton width="180px" height="2.75rem" borderRadius="10px" />
      </div>
    </div>
  );
}

/**
 * Payment page skeleton
 */
export function PembayaranSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton width="200px" height="1.25rem" />
      <SkeletonCard height="auto">
        <div className="text-center py-4">
          <Skeleton width="100px" height="0.7rem" style={{ margin: '0 auto 0.75rem' }} />
          <Skeleton width="200px" height="2rem" style={{ margin: '0 auto 0.5rem' }} />
          <Skeleton width="150px" height="0.75rem" style={{ margin: '0 auto' }} />
        </div>
      </SkeletonCard>
      <SkeletonCard height="auto">
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex justify-between py-1">
              <Skeleton width="35%" height="0.85rem" />
              <Skeleton width="45%" height="0.85rem" />
            </div>
          ))}
        </div>
      </SkeletonCard>
      <Skeleton width="100%" height="3rem" borderRadius="10px" />
    </div>
  );
}

export default Skeleton;
