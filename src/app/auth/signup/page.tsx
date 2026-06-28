'use client';
import AuthForm from '@/components/AuthForm';

export default function Signup() {
  return (
    <div
      className="container flex-center"
      style={{
        padding: '4rem 1rem',
        minHeight: 'calc(100vh - var(--navbar-height))',
        position: 'relative'
      }}
    >
      {/* Decorative Orbs */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)',
          top: '15%',
          right: '15%',
          zIndex: -1,
          filter: 'blur(30px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)',
          bottom: '15%',
          left: '15%',
          zIndex: -1,
          filter: 'blur(30px)'
        }}
      />

      <AuthForm mode="signup" />
    </div>
  );
}
