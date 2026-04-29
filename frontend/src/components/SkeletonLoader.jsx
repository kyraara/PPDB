import { motion } from 'framer-motion';

/**
 * Reusable Skeleton Loader component.
 * Usage:
 *   <Skeleton width="100%" height="1.5rem" />
 *   <Skeleton variant="card" />
 *   <Skeleton variant="avatar" />
 *   <Skeleton variant="text" lines={3} />
 */

const baseStyle = {
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  position: 'relative',
};

function SkeletonPulse({ style, className = '' }) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        ...baseStyle,
        background: 'var(--bg-tertiary)',
        ...style,
      }}
    >
      <div className="skeleton-shimmer" />
    </div>
  );
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius, style = {} }) {
  return (
    <SkeletonPulse
      style={{
        width,
        height,
        borderRadius: borderRadius || 'var(--radius-sm)',
        ...style,
      }}
    />
  );
}

export function SkeletonText({ lines = 3, gap = '0.6rem' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height="0.85rem"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 48 }) {
  return (
    <Skeleton
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="50%"
    />
  );
}

export function SkeletonCard({ height = '200px', children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card-static"
      style={{ padding: '1.5rem', minHeight: height }}
    >
      {children || (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SkeletonAvatar size={48} />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height="1.1rem" />
              <Skeleton width="40%" height="0.75rem" style={{ marginTop: '0.5rem' }} />
            </div>
          </div>
          <SkeletonText lines={2} />
          <Skeleton width="100%" height="2.5rem" borderRadius="var(--radius-md)" />
        </div>
      )}
    </motion.div>
  );
}

/**
 * Beranda page skeleton — matches BerandaPage layout
 */
export function BerandaSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <Skeleton width="220px" height="1.5rem" />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Skeleton width="60px" height="1.5rem" borderRadius="50px" />
          <Skeleton width="80px" height="0.85rem" style={{ marginTop: '0.25rem' }} />
        </div>
      </div>

      {/* Status Card */}
      <SkeletonCard height="180px">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Skeleton width="48px" height="48px" borderRadius="14px" />
          <div style={{ flex: 1 }}>
            <Skeleton width="50%" height="1.2rem" />
            <Skeleton width="35%" height="0.7rem" style={{ marginTop: '0.4rem' }} />
          </div>
        </div>
        <SkeletonText lines={2} />
        <Skeleton width="100%" height="2.5rem" borderRadius="var(--radius-md)" style={{ marginTop: '1rem' }} />
      </SkeletonCard>

      {/* Timeline */}
      <div className="glass-card-static" style={{ padding: '1.5rem' }}>
        <Skeleton width="140px" height="0.75rem" style={{ marginBottom: '1.25rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 5 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <Skeleton width="28px" height="28px" borderRadius="50%" />
                <Skeleton width="35px" height="0.5rem" />
              </div>
              {i < 5 && <Skeleton width="100%" height="2px" style={{ margin: '0 0.35rem', marginBottom: '1.25rem' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card-static" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Skeleton width="32px" height="32px" borderRadius="8px" />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height="0.55rem" />
              <Skeleton width="80%" height="0.75rem" style={{ marginTop: '0.35rem' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="glass-card-static" style={{ padding: '1.25rem' }}>
        <Skeleton width="150px" height="0.75rem" style={{ marginBottom: '0.75rem' }} />
        <SkeletonText lines={2} gap="0.75rem" />
      </div>
    </div>
  );
}

/**
 * Form page skeleton — for FormulirLayout
 */
export function FormSkeleton() {
  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Skeleton width="18px" height="18px" borderRadius="4px" />
        <Skeleton width="180px" height="1.1rem" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i}>
            <Skeleton width="120px" height="0.75rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="100%" height="2.75rem" borderRadius="var(--radius-md)" />
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <Skeleton width="100px" height="0.75rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="100%" height="2.75rem" borderRadius="var(--radius-md)" />
          </div>
          <div>
            <Skeleton width="110px" height="0.75rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="100%" height="2.75rem" borderRadius="var(--radius-md)" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Skeleton width="180px" height="2.75rem" borderRadius="var(--radius-md)" />
      </div>
    </div>
  );
}

/**
 * Payment page skeleton
 */
export function PembayaranSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Skeleton width="200px" height="1.25rem" />

      <SkeletonCard height="auto">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <Skeleton width="100px" height="0.7rem" style={{ margin: '0 auto 0.75rem' }} />
          <Skeleton width="200px" height="2rem" style={{ margin: '0 auto 0.5rem' }} />
          <Skeleton width="150px" height="0.75rem" style={{ margin: '0 auto' }} />
        </div>
      </SkeletonCard>

      <SkeletonCard height="auto">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <Skeleton width="35%" height="0.85rem" />
              <Skeleton width="45%" height="0.85rem" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      <Skeleton width="100%" height="3rem" borderRadius="var(--radius-md)" />
    </div>
  );
}

export default Skeleton;
