import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img
                                src={logo}
                                alt="StayBooker"
                                style={{ height: '280px', width: 'auto', objectFit: 'contain', display: 'block' }}
                            />
                        </div>
                        <p>Your platform for fast, secure, and easy-to-manage bookings.</p>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Explore</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Search Stays</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Account</h4>
                    <ul>
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/profile">My Profile</Link></li>
                        <li><Link to="/bookings">My Bookings</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Host</h4>
                    <ul>
                        <li><Link to="/my-properties">My Properties</Link></li>
                        <li><Link to="/search">All Properties</Link></li>
                        <li><Link to="/features">Platform Benefits</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 StayBooker. All rights reserved.</p>
                <div className="footer-bottom-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/features">Features</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
