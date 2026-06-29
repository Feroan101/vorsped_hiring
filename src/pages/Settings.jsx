import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCredentials,
  getCredentialStats,
  generateStreamCredentials,
  regenerateCredentials,
} from '../data/credentials';
import { STREAMS } from '../data/streams';
import { clearAllResults } from '../utils/storage';

const SETTINGS_PASSWORD = 'vorsped123456';

export default function Settings() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Credentials list and status
  const [credentials, setCredentials] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, used: 0 });
  const [filter, setFilter] = useState('all'); // 'all' | 'available' | 'used'
  const [streamFilter, setStreamFilter] = useState('all'); // 'all' | 'SWE' | 'DAI' etc.
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom generation inputs
  const [genStreamId, setGenStreamId] = useState('SWE');
  const [genCount, setGenCount] = useState(10);
  
  // Modals
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyLink = (code) => {
    const link = `${window.location.origin}/login?code=${code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setCredentials(getCredentials());
    setStats(getCredentialStats());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SETTINGS_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleGenerateKeys = (e) => {
    e.preventDefault();
    if (genCount <= 0 || genCount > 100) return;
    generateStreamCredentials(genStreamId, genCount);
    loadData();
  };

  const handleRegenerate = () => {
    regenerateCredentials();
    loadData();
    setShowRegenModal(false);
  };

  const handleClearResults = () => {
    clearAllResults();
    // Also reset scores inside credentials
    const creds = getCredentials().map(c => ({
      ...c,
      scoreObtained: null,
      scoreTotal: null
    }));
    localStorage.setItem('via_credentials', JSON.stringify(creds));
    loadData();
    setShowClearModal(false);
  };

  const filteredCredentials = credentials.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesStream = streamFilter === 'all' || c.streamId === streamFilter;
    const matchesSearch = searchQuery === '' ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.usedBy && c.usedBy.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesStream && matchesSearch;
  });

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
          <p className="settings__gate-desc">Enter the administrator password to access settings</p>

          <form onSubmit={handleLogin} className="settings__gate-form">
            <input
              type="password"
              className="settings__gate-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoFocus
            />
            {error && <div className="settings__gate-error">{error}</div>}
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

  return (
    <div className="settings">
      <div className="settings__container">
        <div className="settings__header">
          <div>
            <h1 className="settings__title">Settings & Credentials</h1>
            <p className="settings__subtitle">Manage login credentials and assessment data</p>
          </div>
          <button className="settings__logout-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>

        {/* Stats */}
        <div className="settings__stats">
          <div className="settings__stat">
            <span className="settings__stat-value">{stats.total}</span>
            <span className="settings__stat-label">Total Codes</span>
          </div>
          <div className="settings__stat settings__stat--available">
            <span className="settings__stat-value">{stats.available}</span>
            <span className="settings__stat-label">Available</span>
          </div>
          <div className="settings__stat settings__stat--used">
            <span className="settings__stat-value">{stats.used}</span>
            <span className="settings__stat-label">Used</span>
          </div>
        </div>

        {/* Interactive Generation Form */}
        <div className="settings__panel" style={{
          background: 'var(--white)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--gray-200)',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '14px', fontSize: '16px', fontWeight: '500', color: 'var(--navy-light)' }}>
            Generate Stream Credentials
          </h3>
          <form onSubmit={handleGenerateKeys} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)' }}>Hiring Stream</label>
              <select
                value={genStreamId}
                onChange={(e) => setGenStreamId(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--gray-300)',
                  background: 'var(--white)',
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              >
                {Object.values(STREAMS).map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)' }}>Quantity</label>
              <input
                type="number"
                min="1"
                max="100"
                value={genCount}
                onChange={(e) => setGenCount(parseInt(e.target.value) || '')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--gray-300)',
                  fontSize: '14px',
                  width: '90px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                background: 'var(--blue)',
                color: 'var(--white)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Generate Codes
            </button>
          </form>
        </div>

        {/* Global Reset Controls */}
        <div className="settings__actions">
          <button
            className="settings__action-btn settings__action-btn--analytics"
            onClick={() => navigate('/analytics')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            View Analytics Dashboard
          </button>
          <button
            className="settings__action-btn settings__action-btn--regen"
            onClick={() => setShowRegenModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23,4 23,10 17,10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Reset All Codes
          </button>
          <button
            className="settings__action-btn settings__action-btn--clear"
            onClick={() => setShowClearModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear Assessment Data
          </button>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="settings__toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
            <div className="settings__filters" style={{ margin: '0' }}>
              {['all', 'available', 'used'].map(f => (
                <button
                  key={f}
                  className={`settings__filter-btn ${filter === f ? 'settings__filter-btn--active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== 'all' && ` (${f === 'available' ? stats.available : stats.used})`}
                </button>
              ))}
            </div>

            <input
              type="text"
              className="settings__search"
              placeholder="Search code or candidate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '300px', margin: '0' }}
            />
          </div>

          {/* Stream Filtering row */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>Filter Stream:</span>
            <button
              onClick={() => setStreamFilter('all')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                background: streamFilter === 'all' ? 'var(--navy)' : 'var(--gray-100)',
                color: streamFilter === 'all' ? 'var(--white)' : 'var(--gray-600)',
              }}
            >
              All Streams
            </button>
            {Object.values(STREAMS).map(s => (
              <button
                key={s.id}
                onClick={() => setStreamFilter(s.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: streamFilter === s.id ? s.color : 'var(--gray-50)',
                  color: streamFilter === s.id ? 'var(--white)' : 'var(--gray-600)',
                  border: `1px solid ${s.color}30`
                }}
              >
                {s.icon} {s.prefix}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Table */}
        <div className="settings__table-wrapper">
          <table className="settings__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Credential Code</th>
                <th>Stream</th>
                <th>Status</th>
                <th>Used By</th>
                <th>Score / Marks</th>
                <th>Used At</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredentials.map(c => {
                const stream = STREAMS[c.streamId];
                return (
                  <tr key={c.id} className={c.status === 'used' ? 'settings__row--used' : ''}>
                    <td>{c.id}</td>
                    <td className="settings__code">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{c.code}</span>
                        {c.status === 'available' && (
                          <button
                            onClick={() => handleCopyLink(c.code)}
                            title="Copy Invite Link"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: copiedCode === c.code ? 'var(--green)' : 'var(--gray-400)',
                              padding: '4px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                          >
                            {copiedCode === c.code ? (
                              <span style={{ fontSize: '11px', color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 'normal' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copied!
                              </span>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
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
                          {stream.icon} {stream.name}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`settings__status ${
                        c.status === 'available' ? 'settings__status--available' : 'settings__status--used'
                      }`}>
                        {c.status === 'available' ? '● Available' : '● Used'}
                      </span>
                    </td>
                    <td>{c.usedBy || '—'}</td>
                    <td style={{ fontWeight: '500' }}>
                      {c.scoreObtained !== null && c.scoreObtained !== undefined ? (
                        <span style={{
                          color: 'var(--green)',
                          background: 'var(--green-50)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {c.scoreObtained} / {c.scoreTotal}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>—</span>
                      )}
                    </td>
                    <td className="settings__date">
                      {c.usedAt
                        ? new Date(c.usedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                  </tr>
                );
              })}
              {filteredCredentials.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-400)' }}>
                    No matching credentials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Modal */}
      {showRegenModal && (
        <div className="modal-overlay" onClick={() => setShowRegenModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">⚠ Reset All Codes?</h3>
            <p>This will delete all existing credentials and generate the default starter codes (20 SWE, 10 for each other stream). Used credentials will be cleared.</p>
            <div className="modal__actions">
              <button className="modal__btn modal__btn--cancel" onClick={() => setShowRegenModal(false)}>
                Cancel
              </button>
              <button className="modal__btn modal__btn--confirm modal__btn--danger" onClick={handleRegenerate}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Results Modal */}
      {showClearModal && (
        <div className="modal-overlay" onClick={() => setShowClearModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">⚠ Clear All Assessment Results?</h3>
            <p>This will permanently delete all stored candidate results and reset scores in the credentials list. This action cannot be undone.</p>
            <div className="modal__actions">
              <button className="modal__btn modal__btn--cancel" onClick={() => setShowClearModal(false)}>
                Cancel
              </button>
              <button className="modal__btn modal__btn--confirm modal__btn--danger" onClick={handleClearResults}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
