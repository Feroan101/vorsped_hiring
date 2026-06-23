import { useState, useRef, useEffect, useCallback } from 'react';

export default function Calculator({ onClose }) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetDisplay, setResetDisplay] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const calcRef = useRef(null);

  const handleNumber = (num) => {
    if (resetDisplay) {
      setDisplay(String(num));
      setResetDisplay(false);
    } else {
      setDisplay(prev => prev === '0' ? String(num) : prev + num);
    }
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  };

  const handleOperation = (op) => {
    const current = parseFloat(display);
    if (previousValue !== null && !resetDisplay) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    setOperation(op);
    setResetDisplay(true);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  const handleBackspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  // Dragging logic
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.calc__btn') || e.target.closest('.calc__close')) return;
    setIsDragging(true);
    const rect = calcRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 280, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragOffset.y)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleButtonClick = (btn) => {
    switch (btn) {
      case 'C': handleClear(); break;
      case '⌫': handleBackspace(); break;
      case '%':
        setDisplay(prev => String(parseFloat(prev) / 100));
        break;
      case '÷': case '×': case '-': case '+':
        handleOperation(btn);
        break;
      case '.': handleDecimal(); break;
      case '=': handleEquals(); break;
      default: handleNumber(btn); break;
    }
  };

  return (
    <div
      ref={calcRef}
      className="calc"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="calc__header">
        <span className="calc__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="8" y2="10.01" />
            <line x1="12" y1="10" x2="12" y2="10.01" />
            <line x1="16" y1="10" x2="16" y2="10.01" />
            <line x1="8" y1="14" x2="8" y2="14.01" />
            <line x1="12" y1="14" x2="12" y2="14.01" />
            <line x1="16" y1="14" x2="16" y2="14.01" />
            <line x1="8" y1="18" x2="8" y2="18.01" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
            <line x1="16" y1="18" x2="16" y2="18.01" />
          </svg>
          Calculator
        </span>
        <button className="calc__close" onClick={onClose} title="Close calculator">×</button>
      </div>

      <div className="calc__display">
        <div className="calc__operation">
          {previousValue !== null && `${previousValue} ${operation}`}
        </div>
        <div className="calc__value">{display}</div>
      </div>

      <div className="calc__buttons">
        {buttons.map((row, ri) => (
          <div key={ri} className="calc__row">
            {row.map((btn) => (
              <button
                key={btn}
                className={`calc__btn ${
                  ['÷', '×', '-', '+'].includes(btn) ? 'calc__btn--op' :
                  btn === '=' ? 'calc__btn--equals' :
                  btn === 'C' ? 'calc__btn--clear' :
                  btn === '⌫' ? 'calc__btn--back' : ''
                } ${btn === '0' ? 'calc__btn--zero' : ''}`}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
