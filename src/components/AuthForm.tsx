'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!username || username.trim().length < 3) {
          throw new Error('Username must be at least 3 characters.');
        }

        // 1. Sign up the user in Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // 2. Insert user profile metadata
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: signUpData.user.id,
              username: username.trim(),
              avatar_url: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(username.trim())}`
            });

          if (profileError) {
            console.error('Profile creation error:', profileError.message);
            // Sometimes profiles are created via SQL triggers, so we catch this silently if it was already created
            if (!profileError.message.includes('duplicate key')) {
              throw profileError;
            }
          }
        }

        alert('Registration successful! You can now log in.');
        router.push('/auth/login');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        router.push('/play');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass auth-form slide-in" style={{ padding: '2.5rem 2rem', width: '100%', maxWidth: '420px' }}>
      <h2 className="gradient-text hero-title" style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
        {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
        {mode === 'signup' ? 'Register to save stats and climb leaderboards' : 'Log in to continue your scientific journey'}
      </p>

      {error && (
        <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--error-red)', color: 'var(--error-red)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {mode === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. bio_wizard"
              required
              minLength={3}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="wizard@biotiks.com"
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>
          {loading ? 'Processing...' : mode === 'signup' ? 'Register Lab Member 🧪' : 'Authorize Login 🔑'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        {mode === 'signup' ? (
          <span style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="nav-link" style={{ fontWeight: 600 }}>
              Log In
            </Link>
          </span>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>
            New to Biotiks?{' '}
            <Link href="/auth/signup" className="nav-link" style={{ fontWeight: 600 }}>
              Sign Up Free
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
