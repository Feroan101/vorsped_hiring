import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getAllResults, clearSession } from '../utils/storage';
import { generateReport } from '../components/ReportGenerator';

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const session = getSession();
    if (!session || session.phase !== 'completed') {
      navigate('/');
      return;
    }

    // Get the latest result
    const results = getAllResults();
    const latest = results[results.length - 1];

    if (latest) {
      setResult(latest);
    } else {
      // Fallback from session
      setResult({
        candidateName: session.candidateName,
        credentialCode: session.credentialCode,
        streamId: session.streamId,
        streamName: session.streamId === 'SWE' ? 'Software Development' : 'Domain Stream',
        aptitudeScore: session.aptitudeScore || 0,
        aptitudeTotal: session.aptitudeTotal || 15,
        aptitudeDetails: session.aptitudeDetails || [],
        domainScore: session.domainScore || 0,
        domainTotal: session.domainTotal || 10,
        domainDetails: session.domainDetails || [],
        codingScore: session.codingScore || 0,
        codingTotal: session.codingTotal || 0,
        timestamp: new Date().toISOString(),
      });
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  const hasCoding = result.codingTotal > 0;
  const overallScore = result.aptitudeScore + result.domainScore + (result.codingScore || 0);
  const overallTotal = result.aptitudeTotal + result.domainTotal + (result.codingTotal || 0);
  const percentage = ((overallScore / overallTotal) * 100).toFixed(1);
  const passed = percentage >= 50;

  // Category breakdown for Aptitude
  const aptCategoryStats = {};
  if (result.aptitudeDetails) {
    result.aptitudeDetails.forEach(d => {
      if (!aptCategoryStats[d.category]) aptCategoryStats[d.category] = { correct: 0, total: 0 };
      aptCategoryStats[d.category].total++;
      if (d.isCorrect) aptCategoryStats[d.category].correct++;
    });
  }

  // Category breakdown for Domain
  const domCategoryStats = {};
  if (result.domainDetails) {
    result.domainDetails.forEach(d => {
      if (!domCategoryStats[d.category]) domCategoryStats[d.category] = { correct: 0, total: 0 };
      domCategoryStats[d.category].total++;
      if (d.isCorrect) domCategoryStats[d.category].correct++;
    });
  }

  const handleExportPDF = () => {
    generateReport(result);
  };

  const handleGoHome = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="results">
      <div className="results__container">
        {/* Header */}
        <div className="results__header">
          <div className={`results__status ${passed ? 'results__status--pass' : 'results__status--fail'}`}>
            <div className="results__status-icon">
              {passed ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <h1 className="results__status-text">
              {passed ? 'Qualified!' : 'Not Qualified'}
            </h1>
            <p className="results__candidate" style={{ fontSize: '18px', fontWeight: '500' }}>
              {result.candidateName}
            </p>
            <p className="results__stream" style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>
              Hiring Stream: <strong>{result.streamName}</strong>
            </p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="results__scores" style={{ display: 'grid', gridTemplateColumns: hasCoding ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
          <div className="results__score-card results__score-card--aptitude">
            <div className="results__score-label">Aptitude Score</div>
            <div className="results__score-value">
              <span className="results__score-num">{result.aptitudeScore}</span>
              <span className="results__score-total">/ {result.aptitudeTotal}</span>
            </div>
            <div className="results__score-bar">
              <div
                className="results__score-bar-fill results__score-bar-fill--blue"
                style={{ width: `${(result.aptitudeScore / result.aptitudeTotal) * 100}%` }}
              />
            </div>
          </div>

          <div className="results__score-card results__score-card--domain" style={{ borderLeft: '4px solid var(--purple)' }}>
            <div className="results__score-label" style={{ color: 'var(--purple)' }}>Domain MCQ Score</div>
            <div className="results__score-value">
              <span className="results__score-num" style={{ color: 'var(--purple)' }}>{result.domainScore}</span>
              <span className="results__score-total">/ {result.domainTotal}</span>
            </div>
            <div className="results__score-bar" style={{ background: 'var(--gray-100)' }}>
              <div
                className="results__score-bar-fill"
                style={{ width: `${(result.domainScore / result.domainTotal) * 100}%`, background: 'var(--purple)' }}
              />
            </div>
          </div>

          {hasCoding && (
            <div className="results__score-card results__score-card--coding">
              <div className="results__score-label">Coding Score</div>
              <div className="results__score-value">
                <span className="results__score-num">{result.codingScore}</span>
                <span className="results__score-total">/ {result.codingTotal}</span>
              </div>
              <div className="results__score-bar">
                <div
                  className="results__score-bar-fill results__score-bar-fill--cyan"
                  style={{ width: `${(result.codingScore / result.codingTotal) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="results__score-card results__score-card--overall">
            <div className="results__score-label">Overall Score</div>
            <div className="results__score-value">
              <span className="results__score-num results__score-num--large">{overallScore}</span>
              <span className="results__score-total">/ {overallTotal}</span>
            </div>
            <div className="results__percentage">{percentage}%</div>
            <div className="results__score-bar">
              <div
                className={`results__score-bar-fill ${passed ? 'results__score-bar-fill--green' : 'results__score-bar-fill--red'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Breakdown Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '30px' }}>
          {/* Aptitude Breakdown */}
          {Object.keys(aptCategoryStats).length > 0 && (
            <div className="results__breakdown" style={{ margin: '0' }}>
              <h2 className="results__section-title">Aptitude Breakdown</h2>
              <div className="results__categories">
                {Object.entries(aptCategoryStats).map(([cat, data]) => {
                  const pct = ((data.correct / data.total) * 100).toFixed(0);
                  return (
                    <div key={cat} className="results__category">
                      <div className="results__cat-header">
                        <span className="results__cat-name">{cat}</span>
                        <span className="results__cat-score">{data.correct}/{data.total}</span>
                      </div>
                      <div className="results__cat-bar">
                        <div
                          className="results__cat-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Domain Breakdown */}
          {Object.keys(domCategoryStats).length > 0 && (
            <div className="results__breakdown" style={{ margin: '0' }}>
              <h2 className="results__section-title">Domain Breakdown</h2>
              <div className="results__categories">
                {Object.entries(domCategoryStats).map(([cat, data]) => {
                  const pct = ((data.correct / data.total) * 100).toFixed(0);
                  return (
                    <div key={cat} className="results__category">
                      <div className="results__cat-header">
                        <span className="results__cat-name">{cat}</span>
                        <span className="results__cat-score">{data.correct}/{data.total}</span>
                      </div>
                      <div className="results__cat-bar">
                        <div
                          className="results__cat-bar-fill"
                          style={{ width: `${pct}%`, background: 'var(--purple)' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="results__actions" style={{ marginTop: '32px' }}>
          <button className="results__btn results__btn--pdf" onClick={handleExportPDF}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Report as PDF
          </button>
          <button className="results__btn results__btn--home" onClick={handleGoHome}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
