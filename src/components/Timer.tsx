'use client';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export default function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  
  // Choose color based on time left
  let timerClass = 'timer-bar';
  let color = 'var(--accent-green)';
  
  if (timeLeft <= 5) {
    timerClass = 'timer-bar danger pulse';
    color = 'var(--error-red)';
  } else if (timeLeft <= 10) {
    timerClass = 'timer-bar warning';
    color = 'var(--warning-yellow)';
  }

  return (
    <div style={{ width: '100%', marginBottom: '1.5rem' }}>
      <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
        <span>Time Remaining</span>
        <span className={timeLeft <= 5 ? 'pulse' : ''} style={{ color, fontSize: '1.1rem', fontWeight: 700 }}>
          {timeLeft}s
        </span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
        <div
          className={timerClass}
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 1s linear',
            borderRadius: '999px'
          }}
        />
      </div>
    </div>
  );
}
