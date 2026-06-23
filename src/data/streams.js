export const STREAMS = {
  SWE: { id: 'SWE', name: 'Software Development', prefix: 'SWE', color: '#3b82f6', icon: '💻', hasCoding: true, duration: 60 * 60 },
  DAI: { id: 'DAI', name: 'Data & AI', prefix: 'DAI', color: '#8b5cf6', icon: '📊', hasCoding: false, duration: 45 * 60 },
  QAT: { id: 'QAT', name: 'QA Testing', prefix: 'QAT', color: '#10b981', icon: '🧪', hasCoding: false, duration: 45 * 60 },
  CYB: { id: 'CYB', name: 'Cybersecurity', prefix: 'CYB', color: '#ef4444', icon: '🔒', hasCoding: false, duration: 45 * 60 },
  UIX: { id: 'UIX', name: 'UI/UX Design', prefix: 'UIX', color: '#f59e0b', icon: '🎨', hasCoding: false, duration: 45 * 60 },
  BAL: { id: 'BAL', name: 'Business Analyst', prefix: 'BAL', color: '#06b6d4', icon: '📋', hasCoding: false, duration: 45 * 60 },
  SAM: { id: 'SAM', name: 'Sales & Marketing', prefix: 'SAM', color: '#ec4899', icon: '📈', hasCoding: false, duration: 45 * 60 },
  HRD: { id: 'HRD', name: 'HR', prefix: 'HRD', color: '#14b8a6', icon: '👥', hasCoding: false, duration: 45 * 60 },
  FIN: { id: 'FIN', name: 'Finance', prefix: 'FIN', color: '#84cc16', icon: '💰', hasCoding: false, duration: 45 * 60 }
};

export function getStreamById(id) {
  return STREAMS[id] || null;
}
