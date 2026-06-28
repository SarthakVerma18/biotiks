'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserProfile, GameSession } from '@/types';
import { getAvatarUrl, xpForNextLevel, topicLabels } from '@/lib/utils';
import StatsCard from '@/components/StatsCard';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const userId = session.user.id;

        // Fetch profile
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!profileErr && profileData) {
          setProfile(profileData);
        }

        // Fetch recent game sessions
        const { data: sessionData, error: sessionErr } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false })
          .limit(10);

        if (!sessionErr && sessionData) {
          setSessions(sessionData);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="container flex-center" style={{ flexDirection: 'column', height: '60vh' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!profile) return null;

  const xpProgress = xpForNextLevel(profile.xp);
  const accuracy = profile.total_answers > 0
    ? Math.round((profile.correct_answers / profile.total_answers) * 100)
    : 0;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '900px' }}>
      {/* Profile Header Card */}
      <div className="card glass profile-header" style={{ padding: '2.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <img
          src={profile.avatar_url || getAvatarUrl(profile.username)}
          alt="User Avatar"
          className="avatar"
          style={{ width: '100px', height: '100px' }}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '250px' }}>
          <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{profile.username}</h1>
            <span className="level-badge" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>Level {profile.level}</span>
            {profile.streak > 0 && (
              <span className="streak-badge" style={{ fontSize: '0.85rem' }}>
                🔥 {profile.streak} Day Streak
              </span>
            )}
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              <span>XP Progress</span>
              <span>{xpProgress.current} / {xpProgress.needed} XP</span>
            </div>
            <div className="xp-bar" style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                className="xp-fill"
                style={{
                  width: `${xpProgress.progress}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-purple)',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <StatsCard title="Games Played" value={profile.games_played} icon="🎮" color="var(--accent-blue)" />
        <StatsCard title="Accuracy" value={`${accuracy}%`} icon="🎯" color="var(--accent-green)" />
        <StatsCard title="Total XP" value={profile.xp.toLocaleString()} icon="✨" color="var(--accent-purple)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left Side: Recent Game History */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent Labs</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                No completed lab journals found. Let''s do some research! 🧪
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="glass flex-between"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.02)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                      {session.mode.replace('_', ' ')}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {new Date(session.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-green)', display: 'block' }}>
                      +{session.xp_earned} XP
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Score: {session.score}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Achievements / Instructions */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Achievements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass flex-center" style={{ gap: '1rem', padding: '1rem', borderRadius: '12px', justifyContent: 'flex-start' }}>
              <span style={{ fontSize: '2rem' }}>🌱</span>
              <div>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.95rem' }}>First Sprout</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Complete your first game session.</span>
              </div>
            </div>
            <div className="glass flex-center" style={{ gap: '1rem', padding: '1rem', borderRadius: '12px', justifyContent: 'flex-start', opacity: profile.level >= 5 ? 1 : 0.4 }}>
              <span style={{ fontSize: '2rem' }}>🔬</span>
              <div>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.95rem' }}>Full Researcher</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reach profile Level 5 (locked).</span>
              </div>
            </div>
            <div className="glass flex-center" style={{ gap: '1rem', padding: '1rem', borderRadius: '12px', justifyContent: 'flex-start', opacity: accuracy >= 80 ? 1 : 0.4 }}>
              <span style={{ fontSize: '2rem' }}>🧠</span>
              <div>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.95rem' }}>Genius Gene</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Achieve an accuracy rate of 80% or higher.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
