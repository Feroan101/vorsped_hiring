import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import Calculator from '../components/Calculator';
import CodeEditor from '../components/CodeEditor';
import { runCode, isPyodideLoaded, preloadPyodide } from '../utils/codeRunner';
import { selectQuestions } from '../data/aptitudeQuestions';
import { selectDomainQuestions } from '../data/domainQuestions';
import { selectProblems } from '../data/codingProblems';
import { STREAMS } from '../data/streams';
import {
  getSession, saveSession,
  saveAptitudeQuestions, getAptitudeQuestions,
  saveAptitudeAnswer, getAptitudeAnswers,
  saveDomainQuestions, getDomainQuestions,
  saveDomainAnswer, getDomainAnswers,
  saveCodingProblems, getCodingProblems,
  saveCodingSubmission, getCodingSubmissions,
  saveAssessmentState, getAssessmentState,
  saveResult, calculateAptitudeScore, calculateDomainScore
} from '../utils/storage';
import { updateCredentialScore } from '../data/credentials';

export default function Assessment() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [stream, setStream] = useState(null);
  
  // Question and state lists
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores both Aptitude and Domain MCQ/numerical answers
  
  // Coding states (SWE only)
  const [codes, setCodes] = useState({});
  const [languages, setLanguages] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState('idle');
  const [testResults, setTestResults] = useState(null);

  // Layout states
  const [visitedSet, setVisitedSet] = useState(new Set());
  const [flaggedSet, setFlaggedSet] = useState(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timerDuration, setTimerDuration] = useState(45 * 60); // Default, updated on load
  const autoSaveRef = useRef(null);

  // 1. Prevent refresh/reload warning
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

  // 2. Prevent browser back navigation
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 3. Initialize assessment
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate('/login');
      return;
    }
    
    setSession(currentSession);
    const currentStream = STREAMS[currentSession.streamId];
    setStream(currentStream);

    // Retrieve or select questions
    let aptQs = getAptitudeQuestions();
    let domainQs = getDomainQuestions();
    let codingQs = [];

    if (!aptQs) {
      aptQs = selectQuestions();
      saveAptitudeQuestions(aptQs);
    }
    if (!domainQs) {
      domainQs = selectDomainQuestions(currentSession.streamId);
      saveDomainQuestions(domainQs);
    }
    if (currentStream.hasCoding) {
      codingQs = getCodingProblems();
      if (!codingQs) {
        codingQs = selectProblems();
        saveCodingProblems(codingQs);
      }
    }

    // Assemble unified list
    const assembled = [
      ...aptQs.map(q => ({ ...q, section: 'aptitude' })),
      ...domainQs.map(q => ({ ...q, section: 'domain' })),
      ...codingQs.map(p => ({ ...p, section: 'coding', type: 'coding' }))
    ];
    setQuestions(assembled);

    // Load answers
    const savedAptAnswers = getAptitudeAnswers();
    const savedDomainAnswers = getDomainAnswers();
    setAnswers({ ...savedAptAnswers, ...savedDomainAnswers });

    // Restores coding codes & configurations (SWE only)
    if (currentStream.hasCoding) {
      const savedSubmissions = getCodingSubmissions();
      setSubmissions(savedSubmissions || {});

      const savedState = getAssessmentState();
      const restoredCodes = {};
      const restoredLangs = {};
      
      codingQs.forEach(p => {
        restoredCodes[p.id] = savedState?.codes?.[p.id] || p.starterCode.javascript;
        restoredLangs[p.id] = savedState?.languages?.[p.id] || 'javascript';
      });
      setCodes(restoredCodes);
      setLanguages(restoredLangs);

      if (savedState?.currentIndex !== undefined) {
        setCurrentIndex(savedState.currentIndex);
      }
      if (savedState?.visited) {
        setVisitedSet(new Set(savedState.visited));
      }
      if (savedState?.flagged) {
        setFlaggedSet(new Set(savedState.flagged));
      }

      // Preload Python runtime in background if needed
      preloadPyodide().then(() => setPyodideStatus('ready'));
    } else {
      const savedState = getAssessmentState();
      if (savedState?.currentIndex !== undefined) {
        setCurrentIndex(savedState.currentIndex);
      }
      if (savedState?.visited) {
        setVisitedSet(new Set(savedState.visited));
      }
      if (savedState?.flagged) {
        setFlaggedSet(new Set(savedState.flagged));
      }
    }

    // Timer duration setup
    const savedState = getAssessmentState();
    if (savedState?.timeRemaining !== undefined) {
      setTimerDuration(savedState.timeRemaining);
    } else {
      setTimerDuration(currentStream.duration);
    }
  }, [navigate]);

  // 4. Mark question as visited
  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
      setVisitedSet(prev => {
        const newSet = new Set(prev);
        newSet.add(questions[currentIndex].id);
        return newSet;
      });
    }
  }, [currentIndex, questions]);

  // 5. Auto-save state and elapsed time
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (stream) {
        saveAssessmentState({
          currentIndex,
          visited: [...visitedSet],
          flagged: [...flaggedSet],
          codes,
          languages,
          timeRemaining: timerDuration
        });
      }
    }, 5000);

    return () => clearInterval(autoSaveRef.current);
  }, [currentIndex, visitedSet, flaggedSet, codes, languages, timerDuration, stream]);

  // Timer Tick Update
  const handleTimerTick = (secondsLeft) => {
    setTimerDuration(secondsLeft);
  };

  // Answer handler (MCQ & Numerical)
  const handleAnswer = useCallback((questionId, answer, section) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: answer };
      if (section === 'aptitude') {
        saveAptitudeAnswer(questionId, answer);
      } else {
        saveDomainAnswer(questionId, answer);
      }
      return updated;
    });
  }, []);

  // Code editor handler
  const handleCodeChange = (value) => {
    const q = questions[currentIndex];
    if (!q) return;
    setCodes(prev => ({ ...prev, [q.id]: value }));
  };

  const handleLanguageChange = (lang) => {
    const q = questions[currentIndex];
    if (!q) return;
    const currentLang = languages[q.id] || 'javascript';
    setLanguages(prev => ({ ...prev, [q.id]: lang }));
    // Reset to starter code for the new language if code has not been modified
    if (codes[q.id] === q.starterCode[currentLang]) {
      setCodes(prev => ({ ...prev, [q.id]: q.starterCode[lang] }));
    }
  };

  // Run code handler (coding questions only)
  const handleRun = async () => {
    const q = questions[currentIndex];
    if (!q || isRunning) return;
    setIsRunning(true);
    setConsoleOutput('Running code...\n');
    setTestResults(null);

    const code = codes[q.id] || '';
    const lang = languages[q.id] || 'javascript';

    try {
      if (lang === 'python' && !isPyodideLoaded()) {
        setConsoleOutput('Loading Python runtime...\n');
        setPyodideStatus('loading');
        await preloadPyodide();
        setPyodideStatus('ready');
      }

      const result = await runCode(code, lang);
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

  // Run test cases / Submit code (coding questions only)
  const handleSubmitCode = async () => {
    const q = questions[currentIndex];
    if (!q || isRunning) return;
    setIsRunning(true);
    setConsoleOutput('Running test cases...\n');

    const code = codes[q.id] || '';
    const lang = languages[q.id] || 'javascript';
    const sampleTests = q.sampleTestCases;
    let passed = 0;
    let total = sampleTests.length;
    const results = [];

    for (let i = 0; i < sampleTests.length; i++) {
      const test = sampleTests[i];
      setConsoleOutput(prev => prev + `\nTest Case ${i + 1}/${total}: Running...`);

      try {
        const result = await runCode(code, lang);
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

    const scorePercentage = passed / total;
    const problemScore = Math.round(q.points * scorePercentage);

    const submission = {
      problemId: q.id,
      code,
      language: lang,
      testsPassed: passed,
      testsTotal: total,
      score: problemScore,
      maxScore: q.points,
      submittedAt: new Date().toISOString()
    };

    setSubmissions(prev => {
      const updated = { ...prev, [q.id]: submission };
      saveCodingSubmission(q.id, submission);
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
    output += `\n\n━━━ Score: ${problemScore}/${q.points} (${passed}/${total} tests passed) ━━━`;
    setConsoleOutput(output);
    setIsRunning(false);
  };

  // Navigations
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setConsoleOutput('');
      setTestResults(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setConsoleOutput('');
      setTestResults(null);
    }
  };

  const handleJump = (index) => {
    setCurrentIndex(index);
    setConsoleOutput('');
    setTestResults(null);
  };

  const handleFlag = () => {
    const q = questions[currentIndex];
    if (!q) return;
    setFlaggedSet(prev => {
      const newSet = new Set(prev);
      if (newSet.has(q.id)) {
        newSet.delete(q.id);
      } else {
        newSet.add(q.id);
      }
      return newSet;
    });
  };

  // Final submit handler
  const handleFinalSubmit = useCallback(() => {
    setIsSubmitting(true);

    const aptQuestions = questions.filter(q => q.section === 'aptitude');
    const domainQuestions = questions.filter(q => q.section === 'domain');
    const codingQuestions = questions.filter(q => q.section === 'coding');

    // Scores
    const aptResult = calculateAptitudeScore(aptQuestions, answers);
    const domainResult = calculateDomainScore(domainQuestions, answers);

    let codingScore = 0;
    let codingTotal = 0;
    
    if (stream?.hasCoding) {
      codingTotal = 100;
      codingQuestions.forEach(p => {
        if (submissions[p.id]) {
          codingScore += submissions[p.id].score;
        }
      });
    }

    const overallScore = aptResult.score + domainResult.score + codingScore;
    const overallTotal = aptResult.total + domainResult.total + codingTotal;

    // Update session
    const currentSession = getSession();
    if (currentSession) {
      currentSession.phase = 'completed';
      currentSession.aptitudeScore = aptResult.score;
      currentSession.aptitudeTotal = aptResult.total;
      currentSession.aptitudeDetails = aptResult.details;
      currentSession.domainScore = domainResult.score;
      currentSession.domainTotal = domainResult.total;
      currentSession.domainDetails = domainResult.details;
      currentSession.codingScore = codingScore;
      currentSession.codingTotal = codingTotal;
      saveSession(currentSession);

      // Store final result
      saveResult({
        candidateName: currentSession.candidateName,
        credentialCode: currentSession.credentialCode,
        streamId: currentSession.streamId,
        streamName: stream.name,
        aptitudeScore: aptResult.score,
        aptitudeTotal: aptResult.total,
        aptitudeDetails: aptResult.details,
        domainScore: domainResult.score,
        domainTotal: domainResult.total,
        domainDetails: domainResult.details,
        codingScore,
        codingTotal,
        codingSubmissions: submissions,
        timeTaken: Math.round((stream.duration - timerDuration) / 60),
      });

      // Update score in credentials list (frontend storage for Settings viewing)
      updateCredentialScore(currentSession.credentialCode, overallScore, overallTotal);
    }

    setTimeout(() => {
      navigate('/results');
    }, 1000);
  }, [questions, answers, submissions, timerDuration, stream, navigate]);

  const handleTimerExpire = useCallback(() => {
    handleFinalSubmit();
  }, [handleFinalSubmit]);

  if (!session || !stream || questions.length === 0) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Initializing assessment workspace...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCodingQuestion = currentQuestion.type === 'coding';

  // Stats for the submit modal
  const answeredCount = questions.filter(q => {
    if (q.type === 'coding') {
      return submissions[q.id] !== undefined;
    }
    return answers[q.id] !== undefined && answers[q.id] !== '';
  }).length;

  // Render question card for MCQ or numerical
  const renderQuestionWorkspace = () => {
    return (
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
                    onChange={() => handleAnswer(currentQuestion.id, option, currentQuestion.section)}
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
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value, currentQuestion.section)}
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
    );
  };

  // Render Coding Workspace (SWE only)
  const renderCodingWorkspace = () => {
    return (
      <div className="coding__layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: 'calc(100vh - 180px)', padding: '4px' }}>
        {/* Left Side: Problem Statement */}
        <div className="coding__problem" style={{ overflowY: 'auto', padding: '16px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', height: '100%' }}>
          <div className="coding__problem-header">
            <h2 className="coding__problem-title">
              {currentQuestion.displayNumber - 25}. {currentQuestion.title}
            </h2>
            <div className="coding__problem-meta" style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <span className={`coding__diff-badge coding__diff-badge--${currentQuestion.difficulty.toLowerCase()}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="coding__points-badge">{currentQuestion.points} pts</span>
              <button
                className={`aptitude__flag-btn ${flaggedSet.has(currentQuestion.id) ? 'aptitude__flag-btn--active' : ''}`}
                onClick={handleFlag}
                title={flaggedSet.has(currentQuestion.id) ? 'Unflag question' : 'Flag for review'}
                style={{ background: 'transparent', padding: '2px', marginLeft: 'auto' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={flaggedSet.has(currentQuestion.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </button>
            </div>
          </div>
          <div className="coding__problem-desc" style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.6' }}>
            {currentQuestion.description.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={i} className="coding__desc-heading" style={{ marginTop: '14px', marginBottom: '8px', color: 'var(--navy-light)' }}>{line.replace(/\*\*/g, '')}</h4>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} style={{ marginLeft: '16px' }}>{line.slice(2)}</li>;
              }
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} style={{ marginBottom: '8px' }}>{line.replace(/`([^`]+)`/g, (_, code) => code)}</p>;
            })}
          </div>

          <div className="coding__test-cases" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)' }}>
            <h3>Sample Test Cases</h3>
            {currentQuestion.sampleTestCases.map((tc, i) => (
              <div key={i} className="coding__test-case" style={{ background: 'var(--gray-50)', padding: '10px', borderRadius: '6px', marginTop: '10px', fontSize: '13px' }}>
                <div className="coding__tc-row" style={{ marginBottom: '4px' }}>
                  <span className="coding__tc-label" style={{ fontWeight: '500', color: 'var(--gray-500)' }}>Input: </span>
                  <code className="coding__tc-value" style={{ fontFamily: 'var(--font-mono)' }}>{JSON.stringify(tc.input)}</code>
                </div>
                <div className="coding__tc-row">
                  <span className="coding__tc-label" style={{ fontWeight: '500', color: 'var(--gray-500)' }}>Expected: </span>
                  <code className="coding__tc-value" style={{ fontFamily: 'var(--font-mono)' }}>{JSON.stringify(tc.expectedOutput)}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Editor + Console Output */}
        <div className="coding__editor-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <div className="coding__editor-area" style={{ flex: '1 1 60%', minHeight: '300px', background: 'var(--white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
            <CodeEditor
              code={codes[currentQuestion.id] || ''}
              language={languages[currentQuestion.id] || 'javascript'}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          <div className="coding__console" style={{ flex: '0 0 35%', minHeight: '150px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="coding__console-header" style={{ background: 'var(--gray-50)', padding: '8px 14px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gray-600)' }}>Console Output</span>
              <button
                className="coding__console-clear"
                onClick={() => { setConsoleOutput(''); setTestResults(null); }}
                style={{ background: 'transparent', color: 'var(--gray-500)', fontSize: '12px' }}
              >
                Clear
              </button>
            </div>
            <pre className="coding__console-output" style={{ flex: '1', overflowY: 'auto', padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '13px', whiteSpace: 'pre-wrap', background: '#fafafa', margin: '0' }}>
              {consoleOutput || 'Run your code to see output here...'}
            </pre>
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: '8px', background: 'var(--gray-50)' }}>
              <button
                onClick={handleRun}
                disabled={isRunning}
                style={{
                  padding: '6px 16px',
                  borderRadius: '4px',
                  background: 'var(--gray-200)',
                  color: 'var(--gray-700)',
                  fontSize: '13px'
                }}
              >
                Run Code
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={isRunning}
                style={{
                  padding: '6px 16px',
                  borderRadius: '4px',
                  background: 'var(--blue)',
                  color: 'var(--white)',
                  fontSize: '13px'
                }}
              >
                Submit Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPaletteItemStatus = (q, idx) => {
    if (flaggedSet.has(q.id)) return 'flagged';
    if (q.type === 'coding') {
      if (submissions[q.id]) return 'answered';
    } else {
      if (answers[q.id] !== undefined && answers[q.id] !== '') return 'answered';
    }
    if (visitedSet.has(q.id)) return 'visited';
    return 'not-visited';
  };

  return (
    <div className={isCodingQuestion ? "coding" : "aptitude"}>
      {/* Top Bar */}
      <div className={isCodingQuestion ? "coding__topbar" : "aptitude__topbar"}>
        <div className={isCodingQuestion ? "coding__topbar-left" : "aptitude__topbar-left"}>
          <span style={{
            padding: '4px 10px',
            borderRadius: '4px',
            background: `${stream.color}15`,
            color: stream.color,
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '15px' }}>{stream.icon}</span>
            <span>{stream.name}</span>
          </span>
          <span style={{ color: 'var(--gray-500)', fontSize: '14px', marginLeft: '12px' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          {pyodideStatus === 'loading' && isCodingQuestion && (
            <span className="coding__pyodide-badge" style={{ marginLeft: '12px', fontSize: '12px', color: 'var(--yellow)' }}>Loading Python Runtime...</span>
          )}
        </div>
        
        <Timer
          durationSeconds={timerDuration}
          onExpire={handleTimerExpire}
          onTick={handleTimerTick}
        />
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`aptitude__calc-btn ${showCalculator ? 'aptitude__calc-btn--active' : ''}`}
            onClick={() => setShowCalculator(!showCalculator)}
            title="Toggle Calculator"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
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
          
          <button
            className={isCodingQuestion ? "coding__submit-all-btn" : "aptitude__nav-btn aptitude__nav-btn--submit"}
            onClick={() => setShowSubmitModal(true)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              ...(isCodingQuestion ? {} : { height: '36px', display: 'flex', alignItems: 'center', margin: '0' })
            }}
          >
            Submit Assessment
          </button>
        </div>
      </div>

      <div className={isCodingQuestion ? "coding__layout-unified" : "aptitude__layout"} style={isCodingQuestion ? { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', padding: '16px', minHeight: 'calc(100vh - 120px)' } : {}}>
        
        {/* Main Workspace Area */}
        <div className={isCodingQuestion ? "coding__main-workspace" : "aptitude__main"}>
          {isCodingQuestion ? renderCodingWorkspace() : renderQuestionWorkspace()}

          {/* MCQ / Numerical Question navigation controls */}
          {!isCodingQuestion && (
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
                onClick={() => handleAnswer(currentQuestion.id, '', currentQuestion.section)}
              >
                Clear Answer
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  className="aptitude__nav-btn aptitude__nav-btn--submit"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Assessment
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
          )}
        </div>

        {/* Sidebar Palette Area */}
        <div className={isCodingQuestion ? "coding__sidebar-palette" : "aptitude__sidebar"} style={isCodingQuestion ? { background: 'var(--white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' } : {}}>
          
          <div className="palette">
            <div className="palette__header">
              <h3 className="palette__title" style={{ fontSize: '15px' }}>Question Palette</h3>
              <div className="palette__count" style={{ fontSize: '13px' }}>
                {answeredCount} / {questions.length} Done
              </div>
            </div>

            {/* Section A: Aptitude Questions (1 - 15) */}
            <div className="palette__section" style={{ marginTop: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>SECTION A: COMMON APTITUDE</span>
              <div className="palette__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {questions.slice(0, 15).map((q, idx) => (
                  <button
                    key={q.id}
                    className={`palette__item palette__item--${getPaletteItemStatus(q, idx)} ${
                      idx === currentIndex ? 'palette__item--current' : ''
                    }`}
                    onClick={() => handleJump(idx)}
                    title={`Question ${q.displayNumber} — ${q.category}`}
                    style={{ height: '36px', width: '100%', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {q.displayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Section B: Domain Questions (16 - 25) */}
            <div className="palette__section" style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>SECTION B: DOMAIN KNOWLEDGE</span>
              <div className="palette__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {questions.slice(15, 25).map((q, idx) => {
                  const actualIdx = idx + 15;
                  return (
                    <button
                      key={q.id}
                      className={`palette__item palette__item--${getPaletteItemStatus(q, actualIdx)} ${
                        actualIdx === currentIndex ? 'palette__item--current' : ''
                      }`}
                      onClick={() => handleJump(actualIdx)}
                      title={`Question ${q.displayNumber} — ${q.category}`}
                      style={{ height: '36px', width: '100%', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {q.displayNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section C: Coding Questions (26 - 27, SWE only) */}
            {stream.hasCoding && (
              <div className="palette__section" style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>SECTION C: CODING CHALLENGES</span>
                <div className="palette__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {questions.slice(25).map((q, idx) => {
                    const actualIdx = idx + 25;
                    return (
                      <button
                        key={q.id}
                        className={`palette__item palette__item--${getPaletteItemStatus(q, actualIdx)} ${
                          actualIdx === currentIndex ? 'palette__item--current' : ''
                        }`}
                        onClick={() => handleJump(actualIdx)}
                        title={`Coding ${idx + 1}`}
                        style={{ height: '36px', width: '100%', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {q.displayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="palette__legend" style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--gray-200)', gap: '6px' }}>
              <div className="palette__legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span className="palette__dot palette__dot--not-visited"></span>
                <span>Unvisited</span>
              </div>
              <div className="palette__legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span className="palette__dot palette__dot--visited"></span>
                <span>Visited</span>
              </div>
              <div className="palette__legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span className="palette__dot palette__dot--answered"></span>
                <span>Answered</span>
              </div>
              <div className="palette__legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span className="palette__dot palette__dot--flagged"></span>
                <span>Flagged</span>
              </div>
            </div>
          </div>

          {/* Quick instructions / controls for coding layout navigation */}
          {isCodingQuestion && (
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--gray-200)', paddingTop: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                style={{ flex: '1', padding: '8px', fontSize: '13px', borderRadius: '4px', background: 'var(--gray-100)', color: 'var(--gray-700)' }}
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                style={{ flex: '1', padding: '8px', fontSize: '13px', borderRadius: '4px', background: 'var(--gray-100)', color: 'var(--gray-700)' }}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Floating Calculator */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Final Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Submit Assessment?</h3>
            <div className="modal__stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
              <div className="modal__stat" style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: '6px' }}>
                <span className="modal__stat-value" style={{ display: 'block', fontSize: '20px', fontWeight: '500' }}>{answeredCount}</span>
                <span className="modal__stat-label" style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Answered</span>
              </div>
              <div className="modal__stat" style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: '6px' }}>
                <span className="modal__stat-value" style={{ display: 'block', fontSize: '20px', fontWeight: '500' }}>{questions.length - answeredCount}</span>
                <span className="modal__stat-label" style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Unanswered</span>
              </div>
              <div className="modal__stat" style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: '6px' }}>
                <span className="modal__stat-value" style={{ display: 'block', fontSize: '20px', fontWeight: '500' }}>{flaggedSet.size}</span>
                <span className="modal__stat-label" style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Flagged</span>
              </div>
            </div>
            {questions.length - answeredCount > 0 && (
              <p className="modal__warning" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', padding: '8px 12px', borderRadius: '4px', background: 'var(--red-50)', color: 'var(--red)', fontSize: '13px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>You have {questions.length - answeredCount} unanswered question(s).</span>
              </p>
            )}
            <div className="modal__actions" style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setShowSubmitModal(false)}
                style={{ padding: '8px 16px', borderRadius: '4px', background: 'var(--gray-100)', color: 'var(--gray-700)' }}
              >
                Review Answers
              </button>
              <button
                className="modal__btn modal__btn--confirm"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                style={{ padding: '8px 16px', borderRadius: '4px', background: 'var(--blue)', color: 'var(--white)' }}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
