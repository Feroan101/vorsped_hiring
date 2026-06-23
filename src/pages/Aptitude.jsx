import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import Calculator from '../components/Calculator';
import QuestionPalette from '../components/QuestionPalette';
import { selectQuestions, APTITUDE_DURATION_SECONDS } from '../data/aptitudeQuestions';
import {
  getSession, saveSession,
  saveAptitudeAnswer, getAptitudeAnswers,
  saveAptitudeQuestions, getAptitudeQuestions,
  saveAptitudeState, getAptitudeState,
  calculateAptitudeScore,
} from '../utils/storage';

export default function Aptitude() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedSet, setVisitedSet] = useState(new Set());
  const [flaggedSet, setFlaggedSet] = useState(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerDuration, setTimerDuration] = useState(APTITUDE_DURATION_SECONDS);
  const autoSaveRef = useRef(null);

  // Prevent refresh/reload during test
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      const msg = 'Are you sure you want to leave? If reloaded, your progress may be lost.';
      e.returnValue = msg;
      return msg;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Initialize or restore state
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Try to restore previous state
    const savedQuestions = getAptitudeQuestions();
    const savedAnswers = getAptitudeAnswers();
    const savedState = getAptitudeState();

    if (savedQuestions && savedQuestions.length > 0) {
      // Restore previous session
      setQuestions(savedQuestions);
      setAnswers(savedAnswers || {});
      if (savedState) {
        setCurrentIndex(savedState.currentIndex || 0);
        setVisitedSet(new Set(savedState.visited || []));
        setFlaggedSet(new Set(savedState.flagged || []));
        if (savedState.timeRemaining) {
          setTimerDuration(savedState.timeRemaining);
        }
      }
    } else {
      // New exam — select random questions
      const selected = selectQuestions();
      setQuestions(selected);
      saveAptitudeQuestions(selected);
    }
  }, [navigate]);

  // Mark current question as visited
  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
      setVisitedSet(prev => {
        const newSet = new Set(prev);
        newSet.add(questions[currentIndex].id);
        return newSet;
      });
    }
  }, [currentIndex, questions]);

  // Auto-save every 5 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      saveAptitudeState({
        currentIndex,
        visited: [...visitedSet],
        flagged: [...flaggedSet],
      });
    }, 5000);

    return () => clearInterval(autoSaveRef.current);
  }, [currentIndex, visitedSet, flaggedSet]);

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: answer };
      saveAptitudeAnswer(questionId, answer);
      return updated;
    });
  }, []);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleJump = (index) => {
    setCurrentIndex(index);
  };

  const handleFlag = () => {
    const qId = questions[currentIndex].id;
    setFlaggedSet(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) {
        newSet.delete(qId);
      } else {
        newSet.add(qId);
      }
      return newSet;
    });
  };

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);

    // Calculate score
    const result = calculateAptitudeScore(questions, answers);

    // Update session
    const session = getSession();
    if (session) {
      session.phase = 'coding';
      session.aptitudeScore = result.score;
      session.aptitudeTotal = result.total;
      session.aptitudeDetails = result.details;
      saveSession(session);
    }

    setTimeout(() => {
      navigate('/coding');
    }, 1000);
  }, [questions, answers, navigate]);

  const handleTimerExpire = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;

  if (questions.length === 0) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Preparing your assessment...</p>
      </div>
    );
  }

  return (
    <div className="aptitude">
      {/* Top Bar */}
      <div className="aptitude__topbar">
        <div className="aptitude__topbar-left">
          <span className="aptitude__round-badge">Round 1: Aptitude</span>
          <span className="aptitude__progress">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <Timer
          durationSeconds={timerDuration}
          onExpire={handleTimerExpire}
        />
        <div className="aptitude__topbar-right">
          <button
            className={`aptitude__calc-btn ${showCalculator ? 'aptitude__calc-btn--active' : ''}`}
            onClick={() => setShowCalculator(!showCalculator)}
            title="Toggle Calculator"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="10" x2="8" y2="10.01" />
              <line x1="12" y1="10" x2="12" y2="10.01" />
              <line x1="16" y1="10" x2="16" y2="10.01" />
              <line x1="8" y1="14" x2="8" y2="14.01" />
              <line x1="12" y1="14" x2="12" y2="14.01" />
              <line x1="16" y1="14" x2="16" y2="14.01" />
            </svg>
            Calc
          </button>
        </div>
      </div>

      <div className="aptitude__layout">
        {/* Main Question Area */}
        <div className="aptitude__main">
          <div className="aptitude__question-card">
            <div className="aptitude__question-header">
              <span className="aptitude__question-num">Q{currentQuestion.displayNumber}</span>
              <span className={`aptitude__category aptitude__category--${currentQuestion.category.toLowerCase().replace(/\s/g, '-')}`}>
                {currentQuestion.category}
              </span>
              <button
                className={`aptitude__flag-btn ${flaggedSet.has(currentQuestion.id) ? 'aptitude__flag-btn--active' : ''}`}
                onClick={handleFlag}
                title={flaggedSet.has(currentQuestion.id) ? 'Unflag question' : 'Flag for review'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={flaggedSet.has(currentQuestion.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </button>
            </div>

            <div className="aptitude__question-text">
              {currentQuestion.question}
            </div>

            <div className="aptitude__answer-area">
              {currentQuestion.type === 'mcq' ? (
                <div className="aptitude__options">
                  {currentQuestion.options.map((option, i) => (
                    <label
                      key={i}
                      className={`aptitude__option ${
                        answers[currentQuestion.id] === option ? 'aptitude__option--selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={() => handleAnswer(currentQuestion.id, option)}
                      />
                      <span className="aptitude__option-marker">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="aptitude__option-text">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="aptitude__numerical">
                  <label className="aptitude__numerical-label">Enter your answer:</label>
                  <input
                    type="text"
                    className="aptitude__numerical-input"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Type your numerical answer"
                    autoComplete="off"
                  />
                  <p className="aptitude__numerical-hint" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--blue)' }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>Use the calculator if needed. Enter only the final number.</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="aptitude__nav">
            <button
              className="aptitude__nav-btn aptitude__nav-btn--prev"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            <button
              className="aptitude__nav-btn aptitude__nav-btn--clear"
              onClick={() => handleAnswer(currentQuestion.id, '')}
            >
              Clear Answer
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                className="aptitude__nav-btn aptitude__nav-btn--submit"
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Round →
              </button>
            ) : (
              <button
                className="aptitude__nav-btn aptitude__nav-btn--next"
                onClick={handleNext}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="aptitude__sidebar">
          <QuestionPalette
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            visitedSet={visitedSet}
            flaggedSet={flaggedSet}
            onJump={handleJump}
          />
        </div>
      </div>

      {/* Calculator */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Submit Aptitude Round?</h3>
            <div className="modal__stats">
              <div className="modal__stat">
                <span className="modal__stat-value">{answeredCount}</span>
                <span className="modal__stat-label">Answered</span>
              </div>
              <div className="modal__stat">
                <span className="modal__stat-value">{questions.length - answeredCount}</span>
                <span className="modal__stat-label">Unanswered</span>
              </div>
              <div className="modal__stat">
                <span className="modal__stat-value">{flaggedSet.size}</span>
                <span className="modal__stat-label">Flagged</span>
              </div>
            </div>
            {questions.length - answeredCount > 0 && (
              <p className="modal__warning" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--red)' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>You have {questions.length - answeredCount} unanswered question(s).</span>
              </p>
            )}
            <div className="modal__actions">
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setShowSubmitModal(false)}
              >
                Review Answers
              </button>
              <button
                className="modal__btn modal__btn--confirm"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
