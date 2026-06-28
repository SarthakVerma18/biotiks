'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getTodayString } from '@/lib/utils';
import Link from 'next/link';

export default function Daily() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeLeftStr, setTimeLeftStr] = useState('');

  useEffect(() => {
    // Check if user completed it today
    async function checkDailyCompletion() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
          const today = getTodayString();
          
          const { data, error } = await supabase
            .from('daily_scores')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('challenge_date', today);

          if (!error && data && data.length > 0) {
            setCompleted(true);
          }
        }
        
        // Fetch daily leaderboard scores
        const today = getTodayString();
        const { data: dailyScores, error: scoreErr } = await supabase
          .from('daily_scores')
          .select(`
            score,
            time_seconds,
            profiles (
              username,
              avatar_url
            )
          `)
          .eq('challenge_date', today)
          .order('score', { ascending: false })
          .order('time_seconds', { ascending: true })
          .limit(10);

        if (!scoreErr && dailyScores) {
          setScores(dailyScores);
        }
      } catch (err) {
        console.error('Error daily challenge check:', err);
      } finally {
        setLoading(false);
      }
    }

    checkDailyCompletion();

    // Calculate time until next day (UTC or local midnight)
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diffMs = tomorrow.getTime() - now.getTime();
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeLeftStr(`${hrs}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartChallenge = () => {
    if (!userId) {
      alert('Please log in or sign up to play the Daily Challenge and compete on the leaderboard!');
      router.push('/auth/login');
      return;
    }
    router.push('/quiz?mode=daily_challenge');
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ flexDirection: 'column', height: '60vh' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text hero-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Daily Challenge
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Same 10 questions. One attempt. Infinite glory.
        </p>
      </div>

      <div className="grid-2" style={{ width: '100%', maxWidth: '900px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side: Status / Start Card */}
        <div className="card glass daily-banner" style={{ padding: '2.5rem', height: '100%' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Today''s Lab Worksheet
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Earn double XP! Check in every day to test your biology skills, maintain your streak, and see how you rank against fellow researchers.
          </p>

          {completed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '1rem', borderRadius: '12px', textAlign: 'center', fontWeight: 600 }}>
                ✓ Completed for today!
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Next daily challenge resets in:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-teal)', marginTop: '0.25rem' }}>
                  {timeLeftStr}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <button onClick={handleStartChallenge} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Start Daily Challenge ⚡
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Time remaining to play today''s round: <span style={{ fontWeight: 700, color: 'var(--warning-yellow)' }}>{timeLeftStr}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Daily Leaderboard */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏆 Today''s Top Scores
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {scores.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No lab reports submitted yet today. Be the first! ⚡
              </div>
            ) : (
              scores.map((scoreEntry, index) => (
                <div
                  key={index}
                  className="glass flex-between"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.02)'
                  }}
                >
                  <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, width: '20px', color: 'var(--text-secondary)' }}>{index + 1}</span>
                    <img
                      src={scoreEntry.profiles?.avatar_url || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${scoreEntry.profiles?.username}`}
                      alt="Avatar"
                      className="avatar"
                      style={{ width: '28px', height: '28px' }}
                    />
                    <span style={{ fontWeight: 600 }}>{scoreEntry.profiles?.username || 'Scientist'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-teal)', marginRight: '0.5rem' }}>{scoreEntry.score} pts</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({scoreEntry.time_seconds}s)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
