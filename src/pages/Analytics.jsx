import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResults } from '../utils/storage';
import { STREAMS } from '../data/streams';

const ADMIN_PASSWORD = 'vorsped123456';

export default function Analytics() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [streamFilter, setStreamFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      setResults(getAllResults());
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  // Password Gate
  if (!isAuthenticated) {
    return (
      <div className="settings">
        <div className="settings__gate">
          <div className="settings__gate-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="settings__gate-title">Admin Access Required</h2>
          <p className="settings__gate-desc">Enter the administrator password to view analytics</p>

          <form onSubmit={handleLogin} className="settings__gate-form">
            <input
              type="password"
              className="settings__gate-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
              autoFocus
            />
            {authError && <div className="settings__gate-error">{authError}</div>}
            <button type="submit" className="settings__gate-btn">
              Unlock
            </button>
          </form>

          <button className="settings__back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="analytics">
        <div className="analytics__empty" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          <h2 style={{ marginTop: '16px' }}>No Assessment Data Yet</h2>
          <p style={{ color: 'var(--gray-500)' }}>Analytics will appear here once candidates complete assessments.</p>
          <button className="settings__back-btn" onClick={() => navigate('/settings')} style={{ marginTop: '20px' }}>
            ← Back to Settings
          </button>
        </div>
      </div>
    );
  }

  // Filtered results
  const filteredResults = results.filter(r => {
    return streamFilter === 'all' || r.streamId === streamFilter;
  });

  // Global calculations based on filtered set
  const totalCount = filteredResults.length;
  const avgAptitude = totalCount > 0
    ? (filteredResults.reduce((s, r) => s + r.aptitudeScore, 0) / totalCount).toFixed(1)
    : '0.0';
  
  // Average overall percentage
  const avgOverallPct = totalCount > 0
    ? (filteredResults.reduce((s, r) => {
        const score = r.aptitudeScore + r.domainScore + (r.codingScore || 0);
        const total = r.aptitudeTotal + r.domainTotal + (r.codingTotal || 0);
        return s + ((score / total) * 100);
      }, 0) / totalCount).toFixed(1)
    : '0.0';

  const passCount = filteredResults.filter(r => {
    const score = r.aptitudeScore + r.domainScore + (r.codingScore || 0);
    const total = r.aptitudeTotal + r.domainTotal + (r.codingTotal || 0);
    return (score / total) * 100 >= 50;
  }).length;
  const passPercentage = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(0) : '0';

  // Topic metrics from all results (Aptitude + Domain)
  const topicStats = {};
  filteredResults.forEach(r => {
    if (r.aptitudeDetails) {
      r.aptitudeDetails.forEach(d => {
        if (!topicStats[d.category]) topicStats[d.category] = { correct: 0, total: 0 };
        topicStats[d.category].total++;
        if (d.isCorrect) topicStats[d.category].correct++;
      });
    }
    if (r.domainDetails) {
      r.domainDetails.forEach(d => {
        if (!topicStats[d.category]) topicStats[d.category] = { correct: 0, total: 0 };
        topicStats[d.category].total++;
        if (d.isCorrect) topicStats[d.category].correct++;
      });
    }
  });

  // Calculate stream averages across all unfiltered results to help comparison
  const streamAverages = {};
  results.forEach(r => {
    const streamId = r.streamId || 'SWE';
    if (!streamAverages[streamId]) {
      streamAverages[streamId] = { totalPct: 0, count: 0 };
    }
    const score = r.aptitudeScore + r.domainScore + (r.codingScore || 0);
    const total = r.aptitudeTotal + r.domainTotal + (r.codingTotal || 0);
    streamAverages[streamId].totalPct += (score / total) * 100;
    streamAverages[streamId].count++;
  });

  // Sorted list
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'timestamp') {
      return sortOrder === 'desc'
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp);
    }
    if (sortBy === 'overall') {
      const scoreA = a.aptitudeScore + a.domainScore + (a.codingScore || 0);
      const totalA = a.aptitudeTotal + a.domainTotal + (a.codingTotal || 0);
      const scoreB = b.aptitudeScore + b.domainScore + (b.codingScore || 0);
      const totalB = b.aptitudeTotal + b.domainTotal + (b.codingTotal || 0);
      return sortOrder === 'desc'
        ? (scoreB / totalB) - (scoreA / totalA)
        : (scoreA / totalA) - (scoreB / totalB);
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc'
        ? b.candidateName.localeCompare(a.candidateName)
        : a.candidateName.localeCompare(b.candidateName);
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="analytics">
      <div className="analytics__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="analytics__title">Analytics Dashboard</h1>
          <p className="analytics__subtitle">{results.length} total assessments completed</p>
        </div>
        <button
          className="settings__logout-btn"
          onClick={() => navigate('/settings')}
          style={{ background: 'var(--gray-200)', color: 'var(--gray-700)', padding: '8px 16px', borderRadius: '6px' }}
        >
          ← Back to Settings
        </button>
      </div>

      {/* Stream Filter toolbar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>Filter Stream View:</span>
        <button
          onClick={() => setStreamFilter('all')}
          style={{
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            background: streamFilter === 'all' ? 'var(--navy)' : 'var(--gray-100)',
            color: streamFilter === 'all' ? 'var(--white)' : 'var(--gray-600)',
          }}
        >
          All Candidates
        </button>
        {Object.values(STREAMS).map(s => (
          <button
            key={s.id}
            onClick={() => setStreamFilter(s.id)}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              background: streamFilter === s.id ? s.color : 'var(--gray-50)',
              color: streamFilter === s.id ? 'var(--white)' : 'var(--gray-600)',
              border: `1px solid ${s.color}30`
            }}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="analytics__stats">
        <div className="analytics__stat-card">
          <div className="analytics__stat-icon analytics__stat-icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          </div>
          <div className="analytics__stat-info">
            <span className="analytics__stat-value">{avgAptitude}</span>
            <span className="analytics__stat-label">Avg Aptitude Score</span>
          </div>
        </div>

        <div className="analytics__stat-card">
          <div className="analytics__stat-icon analytics__stat-icon--cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="12,18 18,12 12,6" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          </div>
          <div className="analytics__stat-info">
            <span className="analytics__stat-value">{avgOverallPct}%</span>
            <span className="analytics__stat-label">Avg Overall Score</span>
          </div>
        </div>

        <div className="analytics__stat-card">
          <div className="analytics__stat-icon analytics__stat-icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <div className="analytics__stat-info">
            <span className="analytics__stat-value">{passPercentage}%</span>
            <span className="analytics__stat-label">Pass Rate (&gt;=50%)</span>
          </div>
        </div>

        <div className="analytics__stat-card">
          <div className="analytics__stat-icon analytics__stat-icon--navy">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="analytics__stat-info">
            <span className="analytics__stat-value">{totalCount}</span>
            <span className="analytics__stat-label">Filtered Candidates</span>
          </div>
        </div>
      </div>

      {/* Grid Layout panels */}
      <div className="analytics__panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Stream Performance Averages */}
        <div className="analytics__panel" style={{ margin: '0' }}>
          <h2 className="analytics__panel-title" style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', color: 'var(--yellow)' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            Stream Performance Averages
          </h2>
          <div className="analytics__top-list">
            {Object.values(STREAMS).map(s => {
              const data = streamAverages[s.id];
              const avg = data ? (data.totalPct / data.count).toFixed(1) : null;
              return (
                <div key={s.id} className="analytics__top-item" style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '16px' }}>{s.icon}</span>
                  <span className="analytics__top-name" style={{ flex: '1', marginLeft: '10px' }}>{s.name}</span>
                  <span className="analytics__top-score" style={{ fontWeight: '500' }}>
                    {avg !== null ? `${avg}% (${data.count} candidates)` : <span style={{ color: 'var(--gray-300)' }}>No data</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Performance Breakdown */}
        <div className="analytics__panel" style={{ margin: '0' }}>
          <h2 className="analytics__panel-title" style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', color: 'var(--blue)' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Subject Category Accuracy
          </h2>
          <div className="analytics__topics" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {Object.entries(topicStats).map(([topic, data]) => {
              const pct = ((data.correct / data.total) * 100).toFixed(0);
              const isWeak = pct < 50;
              return (
                <div key={topic} className="analytics__topic">
                  <div className="analytics__topic-header">
                    <span className="analytics__topic-name">{topic}</span>
                    <span className={`analytics__topic-pct ${isWeak ? 'analytics__topic-pct--weak' : ''}`}>
                      {pct}% ({data.correct}/{data.total})
                    </span>
                  </div>
                  <div className="analytics__topic-bar">
                    <div
                      className={`analytics__topic-bar-fill ${isWeak ? 'analytics__topic-bar-fill--weak' : ''}`}
                      style={{ width: `${pct}%`, background: isWeak ? 'var(--red)' : 'var(--blue)' }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(topicStats).length === 0 && (
              <div style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '24px' }}>
                No performance category statistics available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Evaluation Results Table */}
      <div className="analytics__table-section" style={{ marginTop: '24px' }}>
        <h2 className="analytics__panel-title">All Candidate Submissions</h2>
        <div className="analytics__table-wrapper">
          <table className="analytics__table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="analytics__th--sortable">
                  Candidate {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th>Stream</th>
                <th>Aptitude</th>
                <th>Domain MCQ</th>
                <th>Coding Score</th>
                <th onClick={() => handleSort('overall')} className="analytics__th--sortable">
                  Overall Score {sortBy === 'overall' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th>Status</th>
                <th onClick={() => handleSort('timestamp')} className="analytics__th--sortable">
                  Date {sortBy === 'timestamp' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((r, i) => {
                const stream = STREAMS[r.streamId];
                const score = r.aptitudeScore + r.domainScore + (r.codingScore || 0);
                const maxTotal = r.aptitudeTotal + r.domainTotal + (r.codingTotal || 0);
                const pct = ((score / maxTotal) * 100).toFixed(1);
                const didPass = pct >= 50;

                return (
                  <tr key={r.id || i}>
                    <td className="analytics__td-name">{r.candidateName}</td>
                    <td>
                      {stream && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: `${stream.color}15`,
                          color: stream.color,
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {stream.icon} {stream.prefix}
                        </span>
                      )}
                    </td>
                    <td>{r.aptitudeScore} / {r.aptitudeTotal}</td>
                    <td>{r.domainScore} / {r.domainTotal}</td>
                    <td>
                      {r.codingTotal > 0 ? (
                        <span>{r.codingScore} / {r.codingTotal}</span>
                      ) : (
                        <span style={{ color: 'var(--gray-300)' }}>—</span>
                      )}
                    </td>
                    <td><strong>{score} / {maxTotal} ({pct}%)</strong></td>
                    <td>
                      <span className={`analytics__status-badge ${didPass ? 'analytics__status-badge--pass' : 'analytics__status-badge--fail'}`}>
                        {didPass ? 'Qualified' : 'Not Qualified'}
                      </span>
                    </td>
                    <td className="analytics__td-date">
                      {new Date(r.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
              {sortedResults.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-400)' }}>
                    No assessment submissions match the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
