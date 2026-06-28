'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  history: (boolean | null)[]; // array tracking if each question was correct, wrong, or not answered yet
}

export default function ProgressBar({ current, total, history }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div style={{ width: '100%', maxWidth: '650px', marginBottom: '2rem' }}>
      <div className="flex-between" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        <span>Progress</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      
      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: 'var(--accent-teal)',
            transition: 'width 0.3s ease-out'
          }}
        />
      </div>

      {/* History Track Dots */}
      <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        {Array.from({ length: total }).map((_, index) => {
          let dotColor = 'rgba(255,255,255,0.1)';
          let dotBorder = 'none';
          
          if (history[index] === true) {
            dotColor = 'var(--accent-green)';
          } else if (history[index] === false) {
            dotColor = 'var(--error-red)';
          } else if (index === current) {
            dotColor = 'transparent';
            dotBorder = '2px solid var(--accent-teal)';
          }

          return (
            <div
              key={index}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                border: dotBorder,
                transition: 'all 0.3s ease'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
