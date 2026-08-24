// GlowButtonDefs.jsx
export default function GlowButtonDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="glow-btn-eg" x1="0" y1="0" x2="1" y2="0">
          {[
            ["0%",   "#DEE4FD", "-0.2;0;0.2" ],
            ["33%",  "#f0b5ff", "0.2;0.4;0.6"],
            ["66%",  "#ea96ff", "0.4;0.6;0.8"],
            ["100%", "#34369e", "0.6;0.8;1"  ],
          ].map(([off, color, vals]) => (
            <stop key={off} offset={off} stopColor={color}>
              <animate attributeName="offset" values={vals} dur="2s" repeatCount="indefinite" />
            </stop>
          ))}
        </linearGradient>

        <filter
          id="glow-btn-glow"
          x="-80%" y="-80%" width="260%" height="260%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="glow-btn-spark"
          x="-60%" y="-60%" width="220%" height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <radialGradient id="glow-btn-fade">
          <stop offset="0%"   stopColor="white" stopOpacity="1" />
          <stop offset="60%"  stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}