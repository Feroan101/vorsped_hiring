import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { initializeCredentials } from '../data/credentials';
import { STREAMS } from '../data/streams';
import heroLogoImg from '../assets/herosection_logo.png';

export default function Home() {
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize credentials on first load
    initializeCredentials();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Fabric wave parameters
    const waves = [
      {
        y: height * 0.5,
        length: 0.002,
        amplitude: 80,
        speed: 0.008,
        phase: 0,
        color: 'rgba(37, 99, 235, 0.12)', // Blue
        strokeColor: 'rgba(37, 99, 235, 0.25)'
      },
      {
        y: height * 0.55,
        length: 0.0015,
        amplitude: 100,
        speed: 0.006,
        phase: Math.PI * 0.4,
        color: 'rgba(6, 182, 212, 0.10)', // Cyan
        strokeColor: 'rgba(6, 182, 212, 0.20)'
      },
      {
        y: height * 0.45,
        length: 0.0025,
        amplitude: 70,
        speed: 0.01,
        phase: Math.PI * 0.8,
        color: 'rgba(192, 132, 252, 0.08)', // Purple
        strokeColor: 'rgba(192, 132, 252, 0.18)'
      },
      {
        y: height * 0.52,
        length: 0.0018,
        amplitude: 90,
        speed: 0.007,
        phase: Math.PI * 1.2,
        color: 'rgba(245, 158, 11, 0.05)', // Amber
        strokeColor: 'rgba(245, 158, 11, 0.12)'
      }
    ];

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 1;

      // Draw each fabric layer
      waves.forEach((wave) => {
        ctx.beginPath();
        
        // Draw main wave path
        for (let x = 0; x <= width; x += 10) {
          const y = wave.y + 
            Math.sin(x * wave.length + wave.phase + t * wave.speed) * wave.amplitude +
            Math.cos(x * (wave.length * 0.5) - wave.phase + t * (wave.speed * 0.7)) * (wave.amplitude * 0.3);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Complete the polygon down to the bottom to fill
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        // Create elegant gradient fill
        const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, height);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(0.5, wave.color.replace(/[\d.]+\)$/, '0.03)'));
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw flowing fabric borders
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const y = wave.y + 
            Math.sin(x * wave.length + wave.phase + t * wave.speed) * wave.amplitude +
            Math.cos(x * (wave.length * 0.5) - wave.phase + t * (wave.speed * 0.7)) * (wave.amplitude * 0.3);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw vertical mesh lines
        ctx.beginPath();
        for (let x = 0; x <= width; x += 40) {
          const yTop = wave.y + 
            Math.sin(x * wave.length + wave.phase + t * wave.speed) * wave.amplitude +
            Math.cos(x * (wave.length * 0.5) - wave.phase + t * (wave.speed * 0.7)) * (wave.amplitude * 0.3);
          
          ctx.moveTo(x, yTop);
          ctx.lineTo(x, yTop + 250);
        }
        ctx.strokeStyle = wave.strokeColor.replace(/[\d.]+\)$/, '0.04)');
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Secret: click logo 7 times to access settings
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 7) {
      setLogoClicks(0);
      navigate('/settings');
    }
  };

  const assessmentSteps = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: 'Credential Verification',
      desc: 'Verify one-time code & accept privacy guidelines',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
      title: 'Unified Evaluation',
      desc: 'Aptitude & domain tasks in a single timed session',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      title: 'Instant Results',
      desc: 'Instant scoring, statistics & PDF reports generated',
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-glow hero__bg-glow--1"></div>
        <div className="hero__bg-glow hero__bg-glow--2"></div>
        <div className="hero__bg-glow hero__bg-glow--3"></div>
        <div className="hero__bg-glow hero__bg-glow--4"></div>
        <div className="hero__bg-pattern"></div>

        <canvas className="hero__fabric-canvas" ref={canvasRef}></canvas>
        <div className="hero__content">
          <div
            className="hero__logo"
            onClick={handleLogoClick}
            style={{ cursor: 'default', userSelect: 'none' }}
          >
            <img src={heroLogoImg} alt="Vorsped" className="hero__logo-img" draggable={false} onContextMenu={(e) => e.preventDefault()} />
          </div>
          <h1 className="hero__title">
            Vorsped Hiring Assessment
          </h1>
          <p className="hero__tagline">
            A secure, unified evaluation environment designed for modern technical and domain roles.
          </p>
          <button
            className="hero__cta"
            onClick={() => navigate('/login')}
          >
            <span>Start Assessment</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </button>
        </div>
      </section>



      {/* Assessment Flow */}
      <section className="flow-section">
        <h2 className="section-title">Assessment Flow</h2>
        <p className="section-desc">Unified evaluation workflow</p>
        <div className="flow">
          {assessmentSteps.map((step, i) => (
            <div key={i} className="flow__step">
              <div className="flow__icon">{step.icon}</div>
              <h3 className="flow__title">{step.title}</h3>
              <p className="flow__desc">{step.desc}</p>
              {i < assessmentSteps.length - 1 && (
                <div className="flow__arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19,12 12,19 5,12" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Terms & Privacy Section */}
      <section className="legal-section">
        <h2 className="section-title">Legal & Compliance Guidelines</h2>
        <p className="section-desc">Please review the policies governing the Vorsped hiring evaluation platform</p>
        
        <div className="legal-grid">
          <div className="legal-card">
            <div className="legal-card__header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--blue)' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h3>Terms and Conditions</h3>
            </div>
            <div className="legal-card__content">
              <h4>1. Assessment Scope & Code of Conduct</h4>
              <p>This evaluation platform is reserved solely for authorized internal candidates. You are required to complete all quantitative, logical, and code-based components individually without external help, generative tools, or unauthorized materials.</p>
              
              <h4>2. Academic & Professional Integrity</h4>
              <p>All submissions are scanned for structural plagiarism, time-anomaly variations, and browser tab switches. Any identified violations will be logged and forwarded to Vorsped human resource representatives for administrative review.</p>
              
              <h4>3. System & Browser Requirements</h4>
              <p>The assessment requires a stable internet connection and compatible browser environment. Leaving or refreshing the assessment page during active testing periods does not halt the running timers and may trigger auto-submission of current progress.</p>
            </div>
          </div>

          <div className="legal-card">
            <div className="legal-card__header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--cyan)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3>Privacy Policy</h3>
            </div>
            <div className="legal-card__content">
              <h4>1. Personal Data Collection</h4>
              <p>We process your candidate identity information, test response history, coding environment state, final output score metrics, and time duration data strictly to compile talent reports.</p>
              
              <h4>2. Access & Sharing Controls</h4>
              <p>Candidate records are protected. Results are accessible only to authenticated Vorsped administrators. No metrics are visible to other candidates or shared with third-party vendors.</p>
              
              <h4>3. Storage & Retention Rights</h4>
              <p>All submission records are held in securely hosted databases. Candidates can contact administrative support to request details regarding their assessment data retention cycle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Vorsped Hiring. All rights reserved.</p>
        <p className="home-footer__tagline">Talent Evaluation System</p>
      </footer>
    </div>
  );
}
