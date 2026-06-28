'use client';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Question, GameMode, Topic } from '@/types';
import { shuffleArray, calculateXP, calculateScore, calculateLevel, calculateStreak, getTodayString } from '@/lib/utils';
import QuizCard from '@/components/QuizCard';
import Timer from '@/components/Timer';
import ProgressBar from '@/components/ProgressBar';
import ResultScreen from '@/components/ResultScreen';

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const mode = (searchParams.get('mode') as GameMode) || 'quick_play';
  const topic = searchParams.get('topic') as Topic | null;

  // Game configuration based on mode
  const getTimerDuration = () => {
    if (mode === 'survival') return 20;
    if (mode === 'topic_challenge') return 25;
    return 30; // quick play & daily challenge
  };

  const getQuestionLimit = () => {
    if (mode === 'survival') return 100; // soft cap
    if (mode === 'topic_challenge') return 15;
    return 10; // quick play & daily challenge
  };

  const maxTime = getTimerDuration();
  const limit = getQuestionLimit();

  // State Variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(mode === 'survival' ? 3 : 0);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<(boolean | null)[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  
  // Timers and timing references
  const [durationSeconds, setDurationSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameDurationRef = useRef<NodeJS.Timeout | null>(null);
  const totalCorrectTimeRef = useRef(0); // tracks total time remaining for correct answers

  // 1. Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from('questions').select('*');
        
        if (topic) {
          query = query.eq('topic', topic);
        }

        const { data, error: fetchErr } = await query;
        if (fetchErr) throw fetchErr;

        if (!data || data.length === 0) {
          throw new Error('No questions found in the database. Please seed the database first.');
        }

        // Shuffle and take limit
        const selected = shuffleArray(data).slice(0, limit);
        setQuestions(selected);
        setHistory(new Array(selected.length).fill(null));
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Failed to load questions.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [mode, topic, limit]);

  // 2. Start Game Timers
  useEffect(() => {
    if (loading || isFinished || questions.length === 0) return;

    // Game duration counter
    gameDurationRef.current = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);

    // Question countdown timer
    startQuestionTimer();

    return () => {
      clearTimers();
    };
  }, [loading, currentIndex, isFinished, questions]);

  const startQuestionTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(maxTime);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameDurationRef.current) clearInterval(gameDurationRef.current);
  };

  // 3. Game Events
  const handleTimeOut = () => {
    // Handle time run out as a wrong answer
    setSelectedAnswer(-1); // special index for timeout
    setShowExplanation(true);
    
    setHistory((prev) => {
      const next = [...prev];
      next[currentIndex] = false;
      return next;
    });

    if (mode === 'survival') {
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => endGame(), 2000);
        }
        return next;
      });
    }

    // Go to next question after delay
    if (mode !== 'survival' || lives > 1) {
      setTimeout(() => nextQuestion(), 3000);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(index);
    setShowExplanation(true);

    const isCorrect = index === questions[currentIndex].correct_answer;
    
    setHistory((prev) => {
      const next = [...prev];
      next[currentIndex] = isCorrect;
      return next;
    });

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      totalCorrectTimeRef.current += timeLeft;
      
      // Calculate score increment
      const points = calculateScore(1, 1, timeLeft);
      setScore((prev) => prev + points);
    } else {
      if (mode === 'survival') {
        setLives((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            setTimeout(() => endGame(), 2000);
          }
          return next;
        });
      }
    }

    // Move forward after delay
    if (mode !== 'survival' || lives > 0 || (lives === 1 && isCorrect)) {
      setTimeout(() => nextQuestion(), 3000);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= questions.length || (mode === 'survival' && lives <= 0)) {
      endGame();
    } else {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setShowExplanation(false);
      startQuestionTimer();
    }
  };

  const endGame = async () => {
    clearTimers();
    setIsFinished(true);

    // Calculate XP
    const earnedXp = calculateXP(
      correctCount,
      questions.length,
      totalCorrectTimeRef.current,
      questions[0]?.difficulty || 'medium'
    );
    setXpEarned(earnedXp);

    // Save game statistics to Supabase if user is logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;

        // 1. Log game session
        await supabase.from('game_sessions').insert({
          user_id: userId,
          mode,
          score,
          xp_earned: earnedXp,
          correct: correctCount,
          total: questions.length,
          duration_seconds: durationSeconds,
        });

        // 2. Fetch current profile to calculate stats
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profile) {
          const newXp = profile.xp + earnedXp;
          const newLevel = calculateLevel(newXp);
          const currentStreak = profile.streak || 0;
          const newStreak = calculateStreak(profile.last_played, currentStreak);

          await supabase
            .from('profiles')
            .update({
              xp: newXp,
              level: newLevel,
              streak: newStreak,
              last_played: getTodayString(),
              games_played: (profile.games_played || 0) + 1,
              correct_answers: (profile.correct_answers || 0) + correctCount,
              total_answers: (profile.total_answers || 0) + questions.length,
            })
            .eq('id', userId);
        }

        // 3. For daily challenge, also save daily score
        if (mode === 'daily_challenge') {
          await supabase.from('daily_scores').insert({
            user_id: userId,
            challenge_date: getTodayString(),
            score,
            time_seconds: durationSeconds,
          });
        }
      }
    } catch (saveErr) {
      console.error('Error saving statistics:', saveErr);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCorrectCount(0);
    setLives(mode === 'survival' ? 3 : 0);
    setIsFinished(false);
    setDurationSeconds(0);
    totalCorrectTimeRef.current = 0;
    
    // Reshuffle questions
    setQuestions(shuffleArray(questions));
    setHistory(new Array(questions.length).fill(null));
  };

  // 4. Rendering States
  if (loading) {
    return (
      <div className="container flex-center" style={{ flexDirection: 'column', height: '60vh' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading Questions Bank...</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Extracting specimens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex-center" style={{ flexDirection: 'column', height: '60vh', textAlign: 'center', padding: '0 1.5rem' }}>
        <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--error-red)', marginBottom: '0.5rem' }}>Connection Failed</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.5, marginBottom: '2rem' }}>
          {error}
        </p>
        <button onClick={() => router.push('/play')} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Back to Selection
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="container flex-center" style={{ padding: '2rem 1rem' }}>
        <ResultScreen
          score={score}
          correct={correctCount}
          total={questions.length}
          xpEarned={xpEarned}
          durationSeconds={durationSeconds}
          mode={mode}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container flex-center" style={{ flexDirection: 'column', padding: '2rem 1rem' }}>
      {/* Lives / Mode HUD */}
      <div className="flex-between" style={{ width: '100%', maxWidth: '650px', marginBottom: '1.5rem' }}>
        <div className="flex-center" style={{ gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚡</span>
          <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>
            {mode.replace('_', ' ')}
          </span>
        </div>
        
        {mode === 'survival' && (
          <div className="lives-display flex-center" style={{ gap: '0.25rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '1.5rem',
                  opacity: i < lives ? 1 : 0.2,
                  transition: 'opacity 0.3s ease'
                }}
              >
                ❤️
              </span>
            ))}
          </div>
        )}

        {mode !== 'survival' && (
          <div className="glass" style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
            Score: {score}
          </div>
        )}
      </div>

      <ProgressBar current={currentIndex} total={questions.length} history={history} />
      
      <Timer timeLeft={timeLeft} totalTime={maxTime} />

      {currentQuestion && (
        <QuizCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
          showExplanation={showExplanation}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          mode={mode}
        />
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="container flex-center" style={{ flexDirection: 'column', height: '60vh' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading Sandbox Arena...</h2>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
