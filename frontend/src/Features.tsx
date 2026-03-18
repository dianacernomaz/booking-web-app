import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/Features.css';

const features = [
    {
        icon: '🔍',
        title: 'Căutare inteligentă',
        description: 'Găsește rapid cazarea perfectă cu filtre avansate după locație, preț, facilități și rating. Algoritmul nostru îți oferă rezultate personalizate în funcție de preferințele tale.',
        badge: 'Popular',
    },
    {
        icon: '🛡️',
        title: 'Rezervare securizată',
        description: 'Plăți criptate cu SSL, protecție completă a datelor tale personale și financiare. Fiecare tranzacție este monitorizată și verificată în timp real.',
        badge: null,
    },
    {
        icon: '⭐',
        title: 'Recenzii verificate',
        description: 'Numai oaspeți care au stat efectiv la proprietate pot lăsa recenzii. Transparență totală, fără recenzii false sau manipulate.',
        badge: 'Nou',
    },
    {
        icon: '📱',
        title: 'Acces de pe orice dispozitiv',
        description: 'Platformă complet responsivă, optimizată pentru telefon, tabletă și desktop. Rezervă din mers, oricând și oriunde te afli.',
        badge: null,
    },
    {
        icon: '🔔',
        title: 'Notificări în timp real',
        description: 'Primești instant alerte pentru confirmări, reduceri exclusive și actualizări ale rezervărilor tale. Nu mai ratezi nicio ofertă avantajoasă.',
        badge: null,
    },
    {
        icon: '💬',
        title: 'Chat cu proprietarul',
        description: 'Comunică direct cu gazda înainte și după rezervare. Clarifică detalii, solicită servicii suplimentare sau obține sfaturi locale.',
        badge: null,
    },
    {
        icon: '🗺️',
        title: 'Hartă interactivă',
        description: 'Explorează proprietățile pe hartă, descoperă ce se află în jur și alege locația ideală în funcție de obiectivele pe care vrei să le vizitezi.',
        badge: null,
    },
    {
        icon: '🎁',
        title: 'Program de fidelitate',
        description: 'Acumulezi puncte la fiecare rezervare și le transformi în reduceri, nopți gratuite sau upgrade-uri de cameră. Cu cât călătorești mai mult, cu atât câștigi mai mult.',
        badge: 'Exclusiv',
    },
    {
        icon: '🏷️',
        title: 'Prețuri transparente',
        description: 'Nicio taxă ascunsă, nicio surpriză. Prețul afișat este exact prețul pe care îl plătești. Comparăm automat ofertele pentru a-ți găsi cel mai bun deal.',
        badge: null,
    },
];

const stats = [
    { value: '2M+', label: 'Proprietăți listate' },
    { value: '120+', label: 'Țări acoperite' },
    { value: '98%', label: 'Clienți mulțumiți' },
    { value: '24/7', label: 'Suport disponibil' },
];

const Features: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <Header />

            {/* ── Hero ── */}
            <section className="feat-hero">
                <div className="feat-hero-inner">
                    <span className="feat-hero-tag">De ce StayBooker?</span>
                    <h1>Tot ce ai nevoie pentru<br />o experiență perfectă</h1>
                    <p>
                        Am construit StayBooker cu un singur scop: să faci călătoria ta cât mai
                        simplă, sigură și memorabilă. Descoperă funcțiile care ne deosebesc.
                    </p>
                    <button className="feat-cta" onClick={() => navigate('/search')}>
                        Caută cazări acum →
                    </button>
                </div>
                <div className="feat-hero-decoration">
                    <div className="feat-orb feat-orb--1" />
                    <div className="feat-orb feat-orb--2" />
                    <div className="feat-orb feat-orb--3" />
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="feat-stats">
                <div className="feat-stats-inner">
                    {stats.map((s) => (
                        <div key={s.label} className="feat-stat-item">
                            <span className="feat-stat-value">{s.value}</span>
                            <span className="feat-stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Grid ── */}
            <section className="feat-grid-section">
                <div className="feat-grid-header">
                    <h2>Funcții construite pentru tine</h2>
                    <p>Fiecare detaliu al platformei a fost gândit pentru a-ți oferi cea mai bună experiență de rezervare.</p>
                </div>

                <div className="feat-grid">
                    {features.map((f) => (
                        <div key={f.title} className="feat-card">
                            {f.badge && <span className="feat-card-badge">{f.badge}</span>}
                            <div className="feat-card-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="feat-banner">
                <div className="feat-banner-inner">
                    <div className="feat-banner-text">
                        <h2>Gata să explorezi lumea?</h2>
                        <p>Alătură-te milioanelor de călători care folosesc StayBooker pentru a găsi cazarea perfectă.</p>
                    </div>
                    <div className="feat-banner-actions">
                        <button className="feat-banner-btn feat-banner-btn--primary" onClick={() => navigate('/register')}>
                            Creează cont gratuit
                        </button>
                        <button className="feat-banner-btn feat-banner-btn--secondary" onClick={() => navigate('/search')}>
                            Caută acum
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;