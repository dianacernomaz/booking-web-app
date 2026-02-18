import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Stilurile sunt în Home.css (importat în fiecare pagină)

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-content">
                {/* Logo → Home */}
                <div
                    className="header-logo"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="logo-icon">🏨</span>
                    <span className="logo-text">StayBooker</span>
                </div>

                {/* Nav links */}
                <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                    <a href="/#features"    className="nav-link">Features</a>
                    <a href="/#how-it-works" className="nav-link">How It Works</a>
                    <a href="/#pricing"     className="nav-link">Pricing</a>
                    <a href="/#about"       className="nav-link">About</a>
                </nav>

                {/* Auth buttons */}
                <div className="header-actions">
                    <button
                        className="btn-sign-in"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                    <button
                        className="btn-get-started"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>
        </header>
    );
};

export default Header;