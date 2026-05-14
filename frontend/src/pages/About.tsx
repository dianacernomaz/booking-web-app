import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import '../assets/css/Home.css';
import '../assets/css/About.css';

const team = [
    {
        name: 'Alexandru Ionescu',
        role: 'CEO & Co-fondator',
        avatar: '👨‍💼',
        bio: '10 ani de experiență în industria travel. Pasionat de tehnologie și inovație.',
    },
    {
        name: 'Maria Popescu',
        role: 'CTO & Co-fondatoare',
        avatar: '👩‍💻',
        bio: 'Expertă în arhitecturi scalabile și sisteme de plată securizate.',
    },
    {
        name: 'Andrei Constantin',
        role: 'Head of Design',
        avatar: '🎨',
        bio: 'Designer de produs cu viziune user-centric și dragoste pentru detalii.',
    },
    {
        name: 'Elena Dumitrescu',
        role: 'Head of Customer Success',
        avatar: '🤝',
        bio: 'Dedicată excelenței în relația cu clienții și partenerii noștri.',
    },
];

const values = [
    {
        icon: '🎯',
        title: 'Transparență',
        desc: 'Prețuri clare, fără taxe ascunse. Ce vezi este ce plătești. Construim relații bazate pe încredere.',
    },
    {
        icon: '🌍',
        title: 'Accesibilitate',
        desc: 'Credem că o experiență de calitate trebuie să fie disponibilă pentru toată lumea, indiferent de buget.',
    },
    {
        icon: '♻️',
        title: 'Sustenabilitate',
        desc: 'Promovăm cazările eco-friendly și susținem comunitatea locală prin fiecare rezervare.',
    },
    {
        icon: '🚀',
        title: 'Inovație',
        desc: 'Îmbunătățim constant platforma pe baza feedback-ului tău. Niciodată nu ne oprim din evoluat.',
    },
];

const milestones = [
    { year: '2020', event: 'StayBooker ia naștere cu 50 de proprietăți în București.' },
    { year: '2021', event: 'Extindem la nivel național. 5.000 de utilizatori activi.' },
    { year: '2022', event: 'Lansăm aplicația mobilă și integrarea cu 20+ sisteme de plată.' },
    { year: '2023', event: 'Depășim 500.000 de rezervări. Intrăm în Europa Centrală.' },
    { year: '2024', event: 'Atingem 1 milion de utilizatori. Lansăm programul de fidelitate.' },
    { year: '2025', event: 'Prezențî în 120+ țări. 2 milioane de proprietăți listate.' },
];

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <Header />

            {/* ── Hero ── */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <div className="about-hero-inner">
                        <span className="about-tag">Povestea noastră</span>
                        <h1>Construim viitorul<br />călătoriilor</h1>
                        <p>
                            StayBooker a pornit dintr-o idee simplă: rezervarea unei cazări trebuie
                            să fie la fel de plăcută ca vacanța în sine. Suntem o echipă de pasionați
                            care construiește zilnic platforma în care milioane de oameni au încredere.
                        </p>
                    </div>
                    <div className="about-hero-visual">
                        <div className="about-globe">🌍</div>
                        <div className="about-float about-float--1">✈️</div>
                        <div className="about-float about-float--2">🏨</div>
                        <div className="about-float about-float--3">⭐</div>
                    </div>
                </div>
            </section>

            {/* ── Mission ── */}
            <section className="about-mission">
                <div className="about-mission-inner">
                    <div className="about-mission-text">
                        <h2>Misiunea noastră</h2>
                        <p>
                            Vrem să eliminăm barierele dintre călători și locurile în care visează
                            să ajungă. Prin tehnologie, transparență și o comunitate de gazde
                            autentice, transformăm fiecare rezervare într-o amintire frumoasă.
                        </p>
                        <p>
                            Nu suntem doar o platformă de rezervări. Suntem podul dintre tine și
                            experiențele care îți schimbă perspectiva asupra lumii.
                        </p>
                        <button className="about-mission-btn" onClick={() => navigate('/search')}>
                            Descoperă destinații →
                        </button>
                    </div>
                    <div className="about-mission-card">
                        <div className="about-quote">
                            <span className="about-quote-mark">"</span>
                            <p>Fiecare călătorie este o poveste nouă. Noi scriem primul capitol.</p>
                            <footer>— Alexandru Ionescu, CEO</footer>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="about-values">
                <div className="about-section-header">
                    <h2>Valorile care ne ghidează</h2>
                    <p>Principiile după care construim și evoluăm în fiecare zi.</p>
                </div>
                <div className="about-values-grid">
                    {values.map((v) => (
                        <div key={v.title} className="about-value-card">
                            <span className="about-value-icon">{v.icon}</span>
                            <h3>{v.title}</h3>
                            <p>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Timeline ── */}
            <section className="about-timeline-section">
                <div className="about-section-header">
                    <h2>Drumul nostru</h2>
                    <p>De la startup la una dintre cele mai iubite platforme de travel.</p>
                </div>
                <div className="about-timeline">
                    {milestones.map((m, i) => (
                        <div key={m.year} className={`about-milestone ${i % 2 === 0 ? 'about-milestone--left' : 'about-milestone--right'}`}>
                            <div className="about-milestone-dot" />
                            <div className="about-milestone-content">
                                <span className="about-milestone-year">{m.year}</span>
                                <p>{m.event}</p>
                            </div>
                        </div>
                    ))}
                    <div className="about-timeline-line" />
                </div>
            </section>

            {/* ── Team ── */}
            <section className="about-team-section">
                <div className="about-section-header">
                    <h2>Echipa din spatele platformei</h2>
                    <p>Oameni pasionați care construiesc zilnic o experiență mai bună pentru tine.</p>
                </div>
                <div className="about-team-grid">
                    {team.map((m) => (
                        <div key={m.name} className="about-team-card">
                            <div className="about-team-avatar">{m.avatar}</div>
                            <h3>{m.name}</h3>
                            <span className="about-team-role">{m.role}</span>
                            <p>{m.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="about-cta">
                <div className="about-cta-inner">
                    <h2>Fă parte din comunitatea noastră</h2>
                    <p>Alătură-te milioanelor de călători care au ales StayBooker.</p>
                    <div className="about-cta-btns">
                        <button className="feat-banner-btn feat-banner-btn--primary" onClick={() => navigate('/register')}>
                            Înregistrează-te gratuit
                        </button>
                        <button className="feat-banner-btn feat-banner-btn--secondary" onClick={() => navigate('/features')}>
                            Vezi funcțiile →
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
