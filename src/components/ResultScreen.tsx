'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ResultScreenProps {
  score: number;
  correct: number;
  total: number;
  xpEarned: number;
  durationSeconds: number;
  mode: string;
  onRestart: () => void;
}

export default function ResultScreen({
  score,
  correct,
  total,
  xpEarned,
  durationSeconds,
  mode,
  onRestart
}: ResultScreenProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedXp, setAnimatedXp] = useState(0);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  useEffect(() => {
    // Count up animation for score
    const duration = 1500; // ms
    const steps = 60;
    const scoreStep = score / steps;
    const xpStep = xpEarned / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore((prev) => Math.min(score, Math.round(scoreStep * currentStep)));
      setAnimatedXp((prev) => Math.min(xpEarned, Math.round(xpStep * currentStep)));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, xpEarned]);

  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'var(--accent-green)';
    if (accuracy >= 50) return 'var(--warning-yellow)';
    return 'var(--error-red)';
  };

  const getFeedbackMessage = () => {
    if (accuracy >= 90) return '🧬 Master Biologist! Incredible job!';
    if (accuracy >= 75) return '🌿 Outstanding Research! Keep it up!';
    if (accuracy >= 50) return '🔬 Lab Assistant! Good effort!';
    return '🦕 Microbe! Keep studying the material!';
  };

  return (
    <div className="result-screen card glass scale-in flex-center" style={{ flexDirection: 'column', padding: '3rem 2rem', width: '100%', maxWidth: '550px', textAlign: 'center' }}>
      <div className="confetti" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
      
      <h2 className="gradient-text hero-title" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
        Challenge Complete!
      </h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '2rem' }}>
        {getFeedbackMessage()}
      </p>

      {/* Main Score Display */}
      <div className="score-display flex-center" style={{ flexDirection: 'column', width: '100%', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Final Score
        </span>
        <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
          {animatedScore}
        </span>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', marginBottom: '2.5rem' }}>
        <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Accuracy</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: getAccuracyColor() }}>{accuracy}%</span>
        </div>
        <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>XP Gained</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-purple)' }}>+{animatedXp}</span>
        </div>
        <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Time Taken</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{durationSeconds}s</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-center" style={{ gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={onRestart} style={{ flex: 1, minWidth: '150px', padding: '0.75rem 1.5rem' }}>
          Play Again ⚡
        </button>
        <Link href="/play" className="btn-secondary" style={{ flex: 1, minWidth: '150px', padding: '0.75rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
          Change Mode 🎮
        </Link>
      </div>
      
      <Link href="/" className="nav-link" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        Back to Home Menu
      </Link>
    </div>
  );
}
