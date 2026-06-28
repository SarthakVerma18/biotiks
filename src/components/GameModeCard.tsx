'use client';
import Link from 'next/link';

interface GameModeCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  action?: () => void;
}

export default function GameModeCard({ title, description, icon, color, href, action }: GameModeCardProps) {
  const content = (
    <div
      className="game-mode-card glass card"
      style={{
        borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
        height: '100%'
      }}
    >
      <div className="flex-center" style={{
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        backgroundColor: `${color}15`,
        fontSize: '2rem',
        marginBottom: '1.5rem',
        color: color
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
    </div>
  );

  if (action) {
    return (
      <div onClick={action} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      {content}
    </Link>
  );
}
