import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getSession } from '../utils/storage';
import logoImg from '../assets/logo.png';

export default function Navbar({ showNav = true }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read session fresh on every render so name always reflects current candidate
  const session = getSession();

  const isAssessmentActive = location.pathname === '/assessment';

  // Shared logo props to prevent drag/download
  const logoProps = {
    src: logoImg,
    alt: "Vorsped",
    className: "navbar__logo-img",
    draggable: false,
    onContextMenu: (e) => e.preventDefault(),
    style: { userSelect: 'none', pointerEvents: 'auto' },
  };

  // Don't show full navbar during active assessment
  if (isAssessmentActive) {
    return (
      <nav className="navbar navbar--assessment">
        <div className="navbar__brand">
          <img {...logoProps} />
        </div>
        {session && (
          <div className="navbar__session-info">
            <span className="navbar__candidate">{session.candidateName}</span>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <img {...logoProps} />
        </Link>

        {showNav && (
          <>
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
              <Link
                to="/"
                className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
