'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameModeCard from '@/components/GameModeCard';
import { TOPICS } from '@/types';

export default function Play() {
  const router = useRouter();
  const [showTopicModal, setShowTopicModal] = useState(false);

  const gameModes = [
    {
      title: 'Quick Play ⚡',
      description: 'Test your speed and accuracy! 10 random timed questions (30 seconds each). High scores depend on fast correct responses.',
      icon: '⚡',
      color: '#00d4aa',
      href: '/quiz?mode=quick_play',
    },
    {
      title: 'Survival Mode 💀',
      description: 'How long can you last? Continuous stream of questions, 20 seconds limit each. You have 3 lives; every wrong answer costs a life.',
      icon: '💀',
      color: '#f472b6',
      href: '/quiz?mode=survival',
    },
    {
      title: 'Topic Challenge 📚',
      description: 'Focus your studies! Select one of the 6 core biology subjects and receive 15 topic-specific questions with a 25-second timer.',
      icon: '📚',
      color: '#7c5cfc',
      href: '#',
      action: () => setShowTopicModal(true),
    },
    {
      title: 'Daily Challenge 📅',
      description: 'Compete on the daily leaderboard! Everyone answers the exact same 10 questions today. You only get one attempt per day!',
      icon: '📅',
      color: '#fbbf24',
      href: '/daily',
    },
  ];

  const handleSelectTopic = (topicValue: string) => {
    setShowTopicModal(false);
    router.push(`/quiz?mode=topic_challenge&topic=${topicValue}`);
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text hero-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Select Game Mode
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Choose your scientific challenge and enter the arena
        </p>
      </div>

      <div className="grid-2" style={{ width: '100%', maxWidth: '900px', gap: '1.5rem', marginBottom: '3rem' }}>
        {gameModes.map((mode, index) => (
          <GameModeCard
            key={index}
            title={mode.title}
            description={mode.description}
            icon={mode.icon}
            color={mode.color}
            href={mode.href}
            action={mode.action}
          />
        ))}
      </div>

      {/* Topic Selection Modal */}
      {showTopicModal && (
        <div className="modal-overlay flex-center" onClick={() => setShowTopicModal(false)}>
          <div className="modal glass card" style={{ padding: '2rem', width: '100%', maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
              Select Research Topic
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              Choose a specific biology topic to test your knowledge
            </p>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {TOPICS.map((topic) => (
                <button
                  key={topic.value}
                  className="option-btn"
                  onClick={() => handleSelectTopic(topic.value)}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: `${topic.color}15`,
                    fontSize: '1.25rem',
                    color: topic.color
                  }}>
                    {topic.icon}
                  </span>
                  <span style={{ color: 'inherit' }}>{topic.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTopicModal(false)}
              className="btn-secondary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
