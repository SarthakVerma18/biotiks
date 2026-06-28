'use client';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = 'var(--accent-green)' }: StatsCardProps) {
  return (
    <div className="card glass flex-between" style={{ padding: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
          {title}
        </span>
        <span className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {value}
        </span>
      </div>
      <div className="flex-center" style={{
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        backgroundColor: `${color}15`,
        fontSize: '1.5rem',
        color: color
      }}>
        {icon}
      </div>
    </div>
  );
}
