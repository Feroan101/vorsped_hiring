import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateCredential, markCredentialUsed } from '../data/credentials';
import { saveSession, clearSession } from '../utils/storage';
import { STREAMS } from '../data/streams';
import logoImg from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('credential'); // 'credential' | 'name'
  const [credentialCode, setCredentialCode] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);

  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    setTimeout(() => {
      const result = validateCredential(credentialCode);
      if (result.valid) {
        const stream = STREAMS[result.credential.streamId];
        setSelectedStream(stream);
        setStep('name');
      } else {
        setError(result.message);
      }
      setIsValidating(false);
    }, 500);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!selectedStream) {
      setError('Stream data missing. Please re-enter credential code.');
      setStep('credential');
      return;
    }

    // Clear any previous session
    clearSession();

    // Mark credential as used
    markCredentialUsed(credentialCode, candidateName.trim());

    // Create new session
    const session = {
      candidateName: candidateName.trim(),
      credentialCode: credentialCode.trim().toUpperCase(),
      streamId: selectedStream.id,
      startedAt: new Date().toISOString(),
      phase: 'assessment', // unified phase name
    };

    saveSession(session);
    navigate('/assessment');
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <img
            src={logoImg}
            alt="Vorsped"
            className="login__logo"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{ userSelect: 'none' }}
          />
          <h1 className="login__title">Vorsped Hiring</h1>
          <p className="login__subtitle">Enter your credential code to begin the assessment</p>
        </div>

        {step === 'credential' ? (
          <form className="login__form" onSubmit={handleCredentialSubmit}>
            <div className="login__field">
              <label className="login__label" htmlFor="credential-code">
                Credential Code
              </label>
              <input
                id="credential-code"
                type="text"
                className="login__input"
                placeholder="e.g. SWE-ABCD-EFGH"
                value={credentialCode}
                onChange={(e) => {
                  setCredentialCode(e.target.value.toUpperCase());
                  setError('');
                }}
                autoFocus
                autoComplete="off"
              />
              <p className="login__help">Enter the one-time credential code provided to you</p>
            </div>

            {error && (
              <div className="login__error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login__btn"
              disabled={!credentialCode.trim() || isValidating}
            >
              {isValidating ? (
                <>
                  <div className="spinner spinner--small"></div>
                  Validating...
                </>
              ) : (
                <>
                  Verify Code
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          <form className="login__form" onSubmit={handleNameSubmit}>
            <div className="login__success-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              Code verified successfully
            </div>

            {selectedStream && (
              <div className="login__stream-badge" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: `${selectedStream.color}15`,
                color: selectedStream.color,
                border: `1px solid ${selectedStream.color}30`,
                marginBottom: '16px',
                fontSize: '14px',
              }}>
                <span style={{ fontSize: '18px' }}>{selectedStream.icon}</span>
                <span>Assigned Stream: <strong>{selectedStream.name}</strong></span>
              </div>
            )}

            <div className="login__field">
              <label className="login__label" htmlFor="candidate-name">
                Your Full Name
              </label>
              <input
                id="candidate-name"
                type="text"
                className="login__input"
                placeholder="Enter your full name"
                value={candidateName}
                onChange={(e) => {
                  setCandidateName(e.target.value);
                  setError('');
                }}
                autoFocus
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="login__error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <div className="login__info-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Assessment Overview
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--blue)' }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  <span>Total Duration: <strong>{selectedStream ? selectedStream.duration / 60 : 45} minutes</strong> (Unified Session)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--cyan)' }}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Part 1: Common Aptitude (15 questions)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--purple)' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  {selectedStream?.hasCoding ? (
                    <span>Part 2: Domain MCQs (8 questions) + Coding (2 problems)</span>
                  ) : (
                    <span>Part 2: Domain MCQs (10 questions)</span>
                  )}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green)' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                  <span>Results and analytics generated instantly</span>
                </li>
              </ul>
            </div>

            <div className="login__terms-checkbox" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '14px', marginBottom: '8px' }}>
              <input
                id="accept-terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="accept-terms" className="login__label" style={{ fontSize: '13px', color: 'var(--gray-600)', cursor: 'pointer', lineHeight: '1.4' }}>
                I agree to the Terms and Conditions and Privacy Policy governing this internal assessment.
              </label>
            </div>

            <button
              type="submit"
              className="login__btn login__btn--start"
              disabled={!candidateName.trim() || !acceptedTerms}
            >
              Begin Assessment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
          </form>
        )}

        <div className="login__back">
          <button onClick={() => { setStep('credential'); setSelectedStream(null); navigate('/'); }} className="login__back-btn">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
