import { motion } from 'framer-motion';

/**
 * SVG Islamic geometric pattern (8-pointed star / girih)
 * Used as decorative background elements
 */
export default function GeometricPattern({ className = '', opacity = 0.06, size = 400 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
    >
      {/* 8-pointed star */}
      <g stroke="#C9A84C" strokeWidth="1" fill="none">
        {/* Outer octagon */}
        <polygon points="200,20 283,58 342,117 380,200 342,283 283,342 200,380 117,342 58,283 20,200 58,117 117,58" />

        {/* Inner star pattern */}
        <polygon points="200,60 240,120 300,100 280,160 340,200 280,240 300,300 240,280 200,340 160,280 100,300 120,240 60,200 120,160 100,100 160,120" />

        {/* Center octagon */}
        <polygon points="200,120 241,141 260,180 260,220 241,259 200,280 159,259 140,220 140,180 159,141" />

        {/* Connecting lines */}
        <line x1="200" y1="20" x2="200" y2="120" />
        <line x1="380" y1="200" x2="260" y2="200" />
        <line x1="200" y1="380" x2="200" y2="280" />
        <line x1="20" y1="200" x2="140" y2="200" />

        <line x1="283" y1="58" x2="241" y2="141" />
        <line x1="342" y1="283" x2="241" y2="259" />
        <line x1="117" y1="342" x2="159" y2="259" />
        <line x1="58" y1="117" x2="159" y2="141" />

        {/* Decorative circles */}
        <circle cx="200" cy="200" r="30" />
        <circle cx="200" cy="200" r="80" />
        <circle cx="200" cy="200" r="160" />
      </g>

      {/* Small diamonds at cardinal points */}
      <g fill="#C9A84C" opacity="0.4">
        <polygon points="200,10 208,20 200,30 192,20" />
        <polygon points="200,370 208,380 200,390 192,380" />
        <polygon points="10,200 20,208 30,200 20,192" />
        <polygon points="370,200 380,208 390,200 380,192" />
      </g>
    </motion.svg>
  );
}
