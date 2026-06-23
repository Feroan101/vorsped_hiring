import { useState, useEffect, useRef, useCallback } from 'react';

export default function Timer({ durationSeconds, onExpire, onTick, isPaused = false }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleExpire = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (onExpire) onExpire();
  }, [onExpire]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      pausedTimeRef.current = timeLeft;
      return;
    }

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (onTick) onTick(newTime);
        if (newTime <= 0) {
          handleExpire();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, handleExpire, onTick]);

  const isUrgent = timeLeft <= 60;
  const isWarning = timeLeft <= 300 && timeLeft > 60;
  const percentage = (timeLeft / durationSeconds) * 100;

  return (
    <div className={`timer ${isUrgent ? 'timer--urgent' : isWarning ? 'timer--warning' : ''}`}>
      <div className="timer__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      </div>
      <div className="timer__display">
        <span className="timer__time">{formatTime(timeLeft)}</span>
        <span className="timer__label">remaining</span>
      </div>
      <div className="timer__bar">
        <div
          className="timer__bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
