'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getAvatarUrl } from '@/lib/utils';
import { UserProfile } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Play', href: '/play' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Daily', href: '/daily' },
  ];

  return (
    <nav className="navbar glass">
      <div className="container flex-between" style={{ height: '100%', padding: '0 1rem' }}>
        <Link href="/" className="logo flex-center" style={{ gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.75rem', transform: 'rotate(15deg)', display: 'inline-block' }}>🧬</span>
          <span className="gradient-text hero-title" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, padding: 0 }}>Biotiks</span>
        </Link>

        {/* Desktop Links */}
        <div className="flex-center" style={{ gap: '2rem' }}>
          <div className="flex-center nav-links" style={{ gap: '1.5rem' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="auth-section flex-center" style={{ gap: '1rem' }}>
            {user ? (
              <div className="flex-center" style={{ gap: '1rem' }}>
                <Link href="/profile" className="flex-center" style={{ gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={profile?.avatar_url || getAvatarUrl(profile?.username || user.email || 'guest')}
                    alt="Avatar"
                    className="avatar"
                    style={{ width: '32px', height: '32px' }}
                  />
                  <div className="flex-center" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{profile?.username || 'Scientist'}</span>
                    <span className="level-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>Lvl {profile?.level || 1}</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex-center" style={{ gap: '0.75rem' }}>
                <Link href="/auth/login" className="nav-link" style={{ fontSize: '0.9rem' }}>
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
