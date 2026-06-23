import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import CodeEditor from '../components/CodeEditor';
import { selectProblems, CODING_DURATION_SECONDS } from '../data/codingProblems';
import { runCode, isPyodideLoaded, preloadPyodide } from '../utils/codeRunner';
import {
  getSession, saveSession,
  saveCodingSubmission, getCodingSubmissions,
  saveCodingProblems, getCodingProblems,
  saveCodingState, getCodingState,
  saveResult,
} from '../utils/storage';

export default function Coding() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [codes, setCodes] = useState({});
  const [languages, setLanguages] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState('idle');
  const [testResults, setTestResults] = useState(null);
  const [timerDuration, setTimerDuration] = useState(CODING_DURATION_SECONDS);
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

  // Initialize
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    if (session.phase !== 'coding') {
      if (session.phase === 'completed') {
        navigate('/results');
      } else {
        navigate('/aptitude');
      }
      return;
    }

    // Try restore
    const savedProblems = getCodingProblems();
    const savedSubmissions = getCodingSubmissions();
    const savedState = getCodingState();

    if (savedProblems && savedProblems.length > 0) {
      setProblems(savedProblems);
      setSubmissions(savedSubmissions || {});

      // Restore codes and languages
      const restoredCodes = {};
      const restoredLangs = {};
      savedProblems.forEach(p => {
        restoredCodes[p.id] = savedState?.codes?.[p.id] || p.starterCode.javascript;
        restoredLangs[p.id] = savedState?.languages?.[p.id] || 'javascript';
      });
      setCodes(restoredCodes);
      setLanguages(restoredLangs);

      if (savedState?.currentProblemIndex !== undefined) {
        setCurrentProblemIndex(savedState.currentProblemIndex);
      }
      if (savedState?.timeRemaining) {
        setTimerDuration(savedState.timeRemaining);
      }
    } else {
      const selected = selectProblems();
      setProblems(selected);
      saveCodingProblems(selected);

      const initCodes = {};
      const initLangs = {};
      selected.forEach(p => {
        initCodes[p.id] = p.starterCode.javascript;
        initLangs[p.id] = 'javascript';
      });
      setCodes(initCodes);
      setLanguages(initLangs);
    }

    // Preload Pyodide in background
    preloadPyodide().then(() => setPyodideStatus('ready'));
  }, [navigate]);

  // Auto-save
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      saveCodingState({
        currentProblemIndex,
        codes,
        languages,
      });
    }, 5000);
    return () => clearInterval(autoSaveRef.current);
  }, [currentProblemIndex, codes, languages]);

  const currentProblem = problems[currentProblemIndex];
  const currentCode = currentProblem ? (codes[currentProblem.id] || '') : '';
  const currentLanguage = currentProblem ? (languages[currentProblem.id] || 'javascript') : 'javascript';

  const handleCodeChange = (value) => {
    if (!currentProblem) return;
    setCodes(prev => ({ ...prev, [currentProblem.id]: value }));
  };

  const handleLanguageChange = (lang) => {
    if (!currentProblem) return;
    setLanguages(prev => ({ ...prev, [currentProblem.id]: lang }));
    // Reset to starter code for the new language if code hasn't been modified much
    if (codes[currentProblem.id] === currentProblem.starterCode[currentLanguage]) {
      setCodes(prev => ({ ...prev, [currentProblem.id]: currentProblem.starterCode[lang] }));
    }
  };

  const handleRun = async () => {
    if (!currentProblem || isRunning) return;
    setIsRunning(true);
    setConsoleOutput('Running code...\n');
    setTestResults(null);

    try {
      if (currentLanguage === 'python' && !isPyodideLoaded()) {
        setConsoleOutput('Loading Python runtime (first time may take a moment)...\n');
        setPyodideStatus('loading');
        await preloadPyodide();
        setPyodideStatus('ready');
      }

      const result = await runCode(currentCode, currentLanguage);

      let output = '';
      if (result.output) output += result.output + '\n';
      if (result.error) output += `\n❌ Error:\n${result.error}\n`;
      output += `\n⏱ Execution time: ${result.executionTime}ms`;

      setConsoleOutput(output);
    } catch (e) {
      setConsoleOutput(`❌ Execution failed: ${e.message}`);
    }

    setIsRunning(false);
  };

  const handleSubmitProblem = async () => {
    if (!currentProblem || isRunning) return;
    setIsRunning(true);
    setConsoleOutput('Running test cases...\n');

    const sampleTests = currentProblem.sampleTestCases;
    let passed = 0;
    let total = sampleTests.length;
    const results = [];

    for (let i = 0; i < sampleTests.length; i++) {
      const test = sampleTests[i];
      setConsoleOutput(prev => prev + `\nTest Case ${i + 1}/${total}: Running...`);

      try {
        const result = await runCode(currentCode, currentLanguage);
        // Simple output comparison
        const actualOutput = result.output.trim();
        const expectedStr = JSON.stringify(test.expectedOutput);

        const isPass = actualOutput === expectedStr ||
          actualOutput === String(test.expectedOutput) ||
          actualOutput === test.expectedOutput;

        if (isPass) passed++;
        results.push({ index: i + 1, passed: isPass, output: actualOutput, expected: expectedStr });
      } catch (e) {
        results.push({ index: i + 1, passed: false, output: e.message, expected: JSON.stringify(test.expectedOutput) });
      }
    }

    // Calculate score for this problem
    const scorePercentage = passed / total;
    const problemScore = Math.round(currentProblem.points * scorePercentage);

    const submission = {
      problemId: currentProblem.id,
      code: currentCode,
      language: currentLanguage,
      testsPassed: passed,
      testsTotal: total,
      score: problemScore,
      maxScore: currentProblem.points,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions(prev => {
      const updated = { ...prev, [currentProblem.id]: submission };
      saveCodingSubmission(currentProblem.id, submission);
      return updated;
    });

    setTestResults(results);

    let output = `\n━━━ Test Results ━━━\n`;
    results.forEach(r => {
      output += `\nTest ${r.index}: ${r.passed ? '✅ PASSED' : '❌ FAILED'}`;
      if (!r.passed) {
        output += `\n  Expected: ${r.expected}`;
        output += `\n  Got:      ${r.output}`;
      }
    });
    output += `\n\n━━━ Score: ${problemScore}/${currentProblem.points} (${passed}/${total} tests passed) ━━━`;

    setConsoleOutput(output);
    setIsRunning(false);
  };

  const handleFinalSubmit = useCallback(() => {
    setIsSubmitting(true);

    // Calculate total coding score
    let codingScore = 0;
    problems.forEach(p => {
      if (submissions[p.id]) {
        codingScore += submissions[p.id].score;
      }
    });

    const session = getSession();
    if (session) {
      session.phase = 'completed';
      session.codingScore = codingScore;
      session.codingTotal = 100;
      saveSession(session);

      // Save final result
      saveResult({
        candidateName: session.candidateName,
        credentialCode: session.credentialCode,
        aptitudeScore: session.aptitudeScore,
        aptitudeTotal: session.aptitudeTotal,
        aptitudeDetails: session.aptitudeDetails,
        codingScore,
        codingTotal: 100,
        codingSubmissions: submissions,
        timeTaken: 60,
      });
    }

    setTimeout(() => navigate('/results'), 1000);
  }, [problems, submissions, navigate]);

  const handleTimerExpire = useCallback(() => {
    handleFinalSubmit();
  }, [handleFinalSubmit]);

  if (problems.length === 0) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Preparing coding challenges...</p>
      </div>
    );
  }

  return (
    <div className="coding">
      {/* Top Bar */}
      <div className="coding__topbar">
        <div className="coding__topbar-left">
          <span className="coding__round-badge">Round 2: Coding</span>
          {pyodideStatus === 'loading' && (
            <span className="coding__pyodide-badge">Loading Python...</span>
          )}
        </div>
        <Timer
          durationSeconds={timerDuration}
          onExpire={handleTimerExpire}
        />
        <button
          className="coding__submit-all-btn"
          onClick={() => setShowSubmitModal(true)}
        >
          Submit All & Finish
        </button>
      </div>

      {/* Problem Tabs */}
      <div className="coding__tabs">
        {problems.map((p, i) => (
          <button
            key={p.id}
            className={`coding__tab ${i === currentProblemIndex ? 'coding__tab--active' : ''} ${
              submissions[p.id] ? 'coding__tab--submitted' : ''
            }`}
            onClick={() => {
              setCurrentProblemIndex(i);
              setConsoleOutput('');
              setTestResults(null);
            }}
          >
            <span className="coding__tab-num">P{p.displayNumber}</span>
            <span className="coding__tab-title">{p.title}</span>
            <span className={`coding__tab-diff coding__tab-diff--${p.difficulty.toLowerCase()}`}>
              {p.difficulty}
            </span>
            {submissions[p.id] && (
              <span className="coding__tab-score">
                {submissions[p.id].score}/{p.points}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="coding__layout">
        {/* Problem Statement */}
        <div className="coding__problem">
          <div className="coding__problem-header">
            <h2 className="coding__problem-title">
              {currentProblem.displayNumber}. {currentProblem.title}
            </h2>
            <div className="coding__problem-meta">
              <span className={`coding__diff-badge coding__diff-badge--${currentProblem.difficulty.toLowerCase()}`}>
                {currentProblem.difficulty}
              </span>
              <span className="coding__points-badge">{currentProblem.points} pts</span>
            </div>
          </div>
          <div className="coding__problem-desc">
            {currentProblem.description.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={i} className="coding__desc-heading">{line.replace(/\*\*/g, '')}</h4>;
              }
              if (line.startsWith('- ')) {
                return <li key={i}>{line.slice(2)}</li>;
              }
              if (line.trim() === '') return <br key={i} />;
              return <p key={i}>{line.replace(/`([^`]+)`/g, (_, code) => code)}</p>;
            })}
          </div>

          {/* Sample Test Cases */}
          <div className="coding__test-cases">
            <h3>Sample Test Cases</h3>
            {currentProblem.sampleTestCases.map((tc, i) => (
              <div key={i} className="coding__test-case">
                <div className="coding__tc-row">
                  <span className="coding__tc-label">Input:</span>
                  <code className="coding__tc-value">{JSON.stringify(tc.input)}</code>
                </div>
                <div className="coding__tc-row">
                  <span className="coding__tc-label">Expected:</span>
                  <code className="coding__tc-value">{JSON.stringify(tc.expectedOutput)}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor + Console */}
        <div className="coding__editor-panel">
          <div className="coding__editor-area">
            <CodeEditor
              code={currentCode}
              language={currentLanguage}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* Console */}
          <div className="coding__console">
            <div className="coding__console-header">
              <span>Console Output</span>
              <button
                className="coding__console-clear"
                onClick={() => { setConsoleOutput(''); setTestResults(null); }}
              >
                Clear
              </button>
            </div>
            <pre className="coding__console-output">
              {consoleOutput || 'Run your code to see output here...'}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="coding__actions">
            <button
              className="coding__action-btn coding__action-btn--run"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <div className="spinner spinner--small"></div>
                  Running...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
            <button
              className="coding__action-btn coding__action-btn--submit"
              onClick={handleSubmitProblem}
              disabled={isRunning}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              Submit Solution
            </button>
          </div>
        </div>
      </div>

      {/* Submit All Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Submit All & Finish?</h3>
            <div className="modal__stats">
              {problems.map(p => (
                <div key={p.id} className="modal__problem-stat">
                  <span>{p.title}</span>
                  <span className={submissions[p.id] ? 'text-success' : 'text-muted'}>
                    {submissions[p.id] ? `${submissions[p.id].score}/${p.points}` : 'Not submitted'}
                  </span>
                </div>
              ))}
            </div>
            <p className="modal__warning" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--red)' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Once submitted, you cannot return to change your answers.</span>
            </p>
            <div className="modal__actions">
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setShowSubmitModal(false)}
              >
                Continue Coding
              </button>
              <button
                className="modal__btn modal__btn--confirm"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Finish Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
