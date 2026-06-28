'use client';
import Link from 'next/link';
import { TOPICS } from '@/types';

export default function Home() {
  return (
    <div className="container flex-center" style={{ flexDirection: 'column', padding: '4rem 1rem', minHeight: 'calc(100vh - var(--navbar-height))' }}>
      {/* Hero Section */}
      <div className="hero flex-center" style={{ flexDirection: 'column', textAlign: 'center', marginBottom: '4rem', maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', backgroundColor: 'rgba(0,212,170,0.08)', borderRadius: '999px', border: '1px solid rgba(0,212,170,0.2)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-teal)' }} className="pulse">
          ⚡ Biology meets Gamification
        </div>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Test Your Bio IQ in the <span className="gradient-text">Biotiks Arena</span>
        </h1>
        <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '600px' }}>
          Inspired by Matiks. Race against the clock in 4 intense game modes, level up your ranking, master 200+ biology questions, and climb the leaderboard!
        </p>
        <div className="flex-center" style={{ gap: '1.25rem', width: '100%', flexWrap: 'wrap' }}>
          <Link href="/play" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.1rem', textDecoration: 'none', minWidth: '180px' }}>
            Enter Arena ⚡
          </Link>
          <Link href="/daily" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.1rem', textDecoration: 'none', minWidth: '180px' }}>
            Daily Challenge 📅
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid-3" style={{ width: '100%', gap: '2rem', marginBottom: '6rem' }}>
        <div className="card glass float" style={{ padding: '2rem', animationDelay: '0s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏱️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Timed Duels</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Seconds matter! Earn bonus XP for lightning-fast answers, but beware: the clock is always ticking down.
          </p>
        </div>
        <div className="card glass float" style={{ padding: '2rem', animationDelay: '0.2s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔬</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>6 Research Topics</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            From micro-scale Cell Biology to massive Ecosystems. Focused topic challenges test your depth of knowledge.
          </p>
        </div>
        <div className="card glass float" style={{ padding: '2rem', animationDelay: '0.4s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Global Standings</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Register to track your stats, climb levels based on earned XP, and rank against scientists worldwide.
          </p>
        </div>
      </div>

      {/* Topics Showcase */}
      <div style={{ width: '100%', maxWidth: '900px', textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2.5rem' }}>
          Master Six Core Disciplines
        </h2>
        <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TOPICS.map((topic) => (
            <div
              key={topic.value}
              className="glass"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: topic.color
              }}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
