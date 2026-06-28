'use client';

export default function DNAHelix() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
        opacity: 0.04
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-green)" />
            <stop offset="100%" stopColor="var(--accent-teal)" />
          </linearGradient>
        </defs>
        
        {/* Draw a subtle background DNA structure */}
        <path
          d="M 100 0 C 150 100, 50 200, 100 300 C 150 400, 50 500, 100 600 C 150 700, 50 800, 100 900 C 150 1000, 50 1100, 100 1200"
          fill="none"
          stroke="url(#dnaGrad)"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
        <path
          d="M 50 0 C 100 100, 150 200, 50 300 C 100 400, 150 500, 50 600 C 100 700, 150 800, 50 900 C 100 1000, 150 1100, 50 1200"
          fill="none"
          stroke="url(#dnaGrad)"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
        
        {/* Connection rungs */}
        {Array.from({ length: 12 }).map((_, i) => {
          const y = i * 100 + 50;
          return (
            <line
              key={i}
              x1={i % 2 === 0 ? 125 : 75}
              y1={y}
              x2={i % 2 === 0 ? 75 : 125}
              y2={y}
              stroke="url(#dnaGrad)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Floating particles */}
      <div className="floating-particles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="float"
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              backgroundColor: i % 2 === 0 ? 'var(--accent-green)' : 'var(--accent-teal)',
              borderRadius: '50%',
              opacity: 0.3,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
