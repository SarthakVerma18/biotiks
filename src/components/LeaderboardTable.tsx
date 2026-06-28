'use client';
import { UserProfile } from '@/types';
import { getAvatarUrl } from '@/lib/utils';

interface LeaderboardTableProps {
  profiles: UserProfile[];
  currentUserId?: string;
}

export default function LeaderboardTable({ profiles, currentUserId }: LeaderboardTableProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span style={{ fontSize: '1.25rem' }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize: '1.25rem' }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize: '1.25rem' }}>🥉</span>;
    return <span className="leaderboard-rank" style={{ color: 'var(--text-secondary)' }}>{rank}</span>;
  };

  const getAccuracy = (profile: UserProfile) => {
    if (!profile.total_answers) return 0;
    return Math.round((profile.correct_answers / profile.total_answers) * 100);
  };

  return (
    <div className="glass" style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rank</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>User</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Level</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Games</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Accuracy</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Total XP</th>
          </tr>
        </thead>
        <tbody>
          {profiles.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No rankings available yet. Be the first to play! ⚡
              </td>
            </tr>
          ) : (
            profiles.map((profile, index) => {
              const rank = index + 1;
              const isCurrentUser = currentUserId === profile.id;
              
              return (
                <tr
                  key={profile.id}
                  className="leaderboard-row"
                  style={{
                    backgroundColor: isCurrentUser ? 'rgba(0, 212, 170, 0.05)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.02)'
                  }}
                >
                  <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle' }}>
                    {getRankBadge(rank)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle' }}>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                      <img
                        src={profile.avatar_url || getAvatarUrl(profile.username)}
                        alt={profile.username}
                        className="avatar"
                        style={{ width: '36px', height: '36px' }}
                      />
                      <span style={{ fontWeight: isCurrentUser ? 700 : 500, color: isCurrentUser ? 'var(--accent-green)' : 'inherit' }}>
                        {profile.username} {isCurrentUser && ' (You)'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle' }}>
                    <span className="level-badge">Lvl {profile.level}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>
                    {profile.games_played}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>
                    {getAccuracy(profile)}%
                  </td>
                  <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle', textAlign: 'right', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    {profile.xp.toLocaleString()} XP
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
