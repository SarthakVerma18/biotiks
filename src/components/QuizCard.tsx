'use client';
import { Question } from '@/types';
import { topicLabels, difficultyLabels } from '@/lib/utils';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
  showExplanation: boolean;
  questionNumber: number;
  totalQuestions: number;
  mode: string;
}

export default function QuizCard({
  question,
  selectedAnswer,
  onAnswer,
  showExplanation,
  questionNumber,
  totalQuestions,
  mode,
}: QuizCardProps) {
  const getDifficultyBadgeClass = (diff: string) => {
    return `badge badge-${diff}`;
  };

  const getOptionClass = (index: number) => {
    let base = 'option-btn';
    if (selectedAnswer === null) return base;

    if (index === question.correct_answer) {
      return `${base} correct`;
    }
    
    if (selectedAnswer === index && selectedAnswer !== question.correct_answer) {
      return `${base} wrong shake`;
    }

    if (selectedAnswer === index) {
      return `${base} selected`;
    }

    return `${base} disabled`;
  };

  return (
    <div className="card glass slide-in" style={{ padding: '2rem', width: '100%', maxWidth: '650px' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
          Question {questionNumber} / {totalQuestions}
        </span>
        <div className="flex-center" style={{ gap: '0.5rem' }}>
          <span className="badge" style={{ backgroundColor: 'rgba(0, 212, 170, 0.1)', color: 'var(--accent-green)' }}>
            🔬 {topicLabels[question.topic] || question.topic}
          </span>
          <span className={getDifficultyBadgeClass(question.difficulty)}>
            {difficultyLabels[question.difficulty] || question.difficulty}
          </span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.5 }}>
        {question.question}
      </h2>

      <div style={{ display: 'grid', gap: '1rem', width: '100%' }}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(index)}
            onClick={() => selectedAnswer === null && onAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <div className="flex-between" style={{ width: '100%', padding: '0 0.5rem' }}>
              <span style={{ textAlign: 'left' }}>{option}</span>
              {selectedAnswer !== null && index === question.correct_answer && (
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>
              )}
              {selectedAnswer !== null && selectedAnswer === index && selectedAnswer !== question.correct_answer && (
                <span style={{ color: 'var(--error-red)', fontWeight: 700 }}>✗</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="explanation-box fade-in" style={{ marginTop: '2rem' }}>
          <h4 style={{ color: 'var(--accent-green)', marginTop: 0, marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
            Did you know?
          </h4>
          <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
