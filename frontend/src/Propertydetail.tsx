import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/PropertyDetail.css';
import { useCurrency } from './lib/currency';
import { getManagedPropertyById, toManagedPropertyDetail } from './lib/managedProperties';
import { saveBooking, type PaymentMethod } from './lib/bookings';
import { getSession } from './lib/session';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Property {
    id: number;
    title: string;
    location: string;
    city: string;
    country: string;
    address: string;
    price: number;
    priceOriginal: number;
    rating: number;
    reviews: number;
    images: string[];
    features: string[];
    badge?: string;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    availableFrom: string;
    availableTo: string;
    description: string;
    descriptionExtra: string;
    host: string;
    amenities: { icon: string; label: string; available: boolean }[];
    occupiedDays: number[];
    reviewsList: { name: string; date: string; rating: number; color: string; text: string }[];
    nearby: { icon: string; name: string; dist: string }[];
}

// ─── Mock Database ─────────────────────────────────────────────────────────────

export const PROPERTIES_DB: Property[] = [
    {
        id: 1,
        title: 'Luxury Suite cu vedere la mare',
        location: 'Bali, Indonezia',
        city: 'Bali',
        country: 'Indonezia',
        address: 'Jl. Pantai Kuta 12, Bali',
        price: 200,
        priceOriginal: 260,
        rating: 4.9,
        reviews: 128,
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop',
        ],
        features: ['WiFi', 'Piscină', 'Parcare'],
        badge: undefined,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        availableFrom: '2026-02-01',
        availableTo: '2026-12-31',
        description: 'Descoperă paradisul în această suită de lux situată direct pe plaja din Kuta. Cu vedere panoramică la Oceanul Indian, proprietatea oferă un amestec perfect între confortul modern și estetica balineză autentică.',
        descriptionExtra: 'Interiorul a fost decorat de un designer local cu piese artizanale unice, lemn de teak și țesături tradiționale. Piscina privată cu apă sărată și terasa cu șezlonguri sunt disponibile exclusiv pentru oaspeții suitei. Mic dejun inclus preparat de un bucătar local, transfer aeroport inclus.',
        host: 'Wayan S.',
        amenities: [
            { icon: '🌐', label: 'WiFi de mare viteză', available: true },
            { icon: '🏊', label: 'Piscină privată', available: true },
            { icon: '🅿️', label: 'Parcare privată', available: true },
            { icon: '❄️', label: 'Aer condiționat', available: true },
            { icon: '🍳', label: 'Bucătărie echipată', available: true },
            { icon: '📺', label: 'Smart TV', available: true },
            { icon: '🧺', label: 'Mașină de spălat', available: true },
            { icon: '☀️', label: 'Terasă', available: true },
            { icon: '🛁', label: 'Jacuzzi', available: false },
            { icon: '🔥', label: 'Șemineu', available: false },
        ],
        occupiedDays: [3, 4, 5, 14, 15, 22, 23],
        reviewsList: [
            { name: 'Sophie M.', date: 'Ianuarie 2026', rating: 5, color: '#2563eb', text: 'Absolut magic! Priveliștea la apus este de neuitat. Personalul este incredibil de atent și primitor.' },
            { name: 'Marco R.', date: 'Decembrie 2025', rating: 5, color: '#7c3aed', text: 'Cel mai bun sejur din viața mea. Piscina privată, micul dejun inclus și designul autentic balinese — totul a fost perfect.' },
            { name: 'Ana P.', date: 'Noiembrie 2025', rating: 4, color: '#059669', text: 'Proprietate deosebită, curată și bine întreținută. Singurul minus: zgomotul de pe stradă noaptea. Altfel, recomand cu căldură.' },
        ],
        nearby: [
            { icon: '🏖️', name: 'Plaja Kuta', dist: '50 m' },
            { icon: '🛒', name: 'Supermarket', dist: '300 m' },
            { icon: '🍽️', name: 'Restaurant local', dist: '100 m' },
            { icon: '🏥', name: 'Clinică', dist: '2 km' },
            { icon: '✈️', name: 'Aeroport Ngurah Rai', dist: '12 km' },
            { icon: '🎭', name: 'Centru cultural', dist: '800 m' },
        ],
    },
    {
        id: 2,
        title: 'Apartament Modern în Zona Lunitei',
        location: 'București, România',
        city: 'București',
        country: 'România',
        address: 'Str. Luntrei 8, Sector 1, București',
        price: 180,
        priceOriginal: 220,
        rating: 4.7,
        reviews: 94,
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&h=800&fit=crop',
        ],
        features: ['WiFi', 'Bucătărie', 'Terasă'],
        badge: undefined,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        availableFrom: '2026-02-01',
        availableTo: '2026-12-31',
        description: 'Apartament modern și elegant în una dintre cele mai căutate zone rezidențiale din București. Design minimalist cu finisaje premium, perfect pentru cupluri sau profesioniști în city break.',
        descriptionExtra: 'Terasa de 20 mp oferă o priveliște spectaculoasă asupra orașului. Bucătăria este complet echipată cu electrocasnice Bosch. Localizarea excelentă permite accesul rapid la metrou, restaurante și muzee. Parcare subterană disponibilă contra cost.',
        host: 'Andrei M.',
        amenities: [
            { icon: '🌐', label: 'WiFi fibră optică', available: true },
            { icon: '❄️', label: 'Aer condiționat', available: true },
            { icon: '🍳', label: 'Bucătărie completă', available: true },
            { icon: '📺', label: 'Netflix inclus', available: true },
            { icon: '☀️', label: 'Terasă 20 mp', available: true },
            { icon: '🧺', label: 'Mașină de spălat', available: true },
            { icon: '🅿️', label: 'Parcare subterană', available: false },
            { icon: '🏊', label: 'Piscină', available: false },
            { icon: '🛁', label: 'Jacuzzi', available: false },
            { icon: '🐾', label: 'Pet friendly', available: false },
        ],
        occupiedDays: [1, 2, 10, 11, 18, 19, 25],
        reviewsList: [
            { name: 'Elena V.', date: 'Februarie 2026', rating: 5, color: '#dc2626', text: 'Apartament impecabil! Curățenie perfectă, dotări de calitate și localizare excelentă. Andrei a fost disponibil oricând.' },
            { name: 'Radu C.', date: 'Ianuarie 2026', rating: 4, color: '#2563eb', text: 'Sejur plăcut, apartamentul este exact cum apare în poze. Terasa este un bonus minunat. Recomand pentru un weekend în București.' },
            { name: 'Ioana T.', date: 'Decembrie 2025', rating: 5, color: '#7c3aed', text: 'Al doilea sejur la Andrei și tot nu mă dezamăgește. Apartamentul este mereu curat și bine pregătit. Cu siguranță revin!' },
        ],
        nearby: [
            { icon: '🚇', name: 'Metrou Aviatorilor', dist: '200 m' },
            { icon: '🌳', name: 'Parcul Herăstrău', dist: '400 m' },
            { icon: '🍽️', name: 'Restaurant', dist: '150 m' },
            { icon: '🛒', name: 'Mega Image', dist: '300 m' },
            { icon: '🏥', name: 'Spital Floreasca', dist: '1.5 km' },
            { icon: '✈️', name: 'Aeroport Otopeni', dist: '18 km' },
        ],
    },
    {
        id: 3,
        title: 'Cabană Romantică la Munte',
        location: 'Brașov, România',
        city: 'Brașov',
        country: 'România',
        address: 'Str. Poiana Mică 3, Poiana Brașov',
        price: 145,
        priceOriginal: 180,
        rating: 4.8,
        reviews: 203,
        images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
        ],
        features: ['WiFi', 'Șemineu', 'Grădină'],
        badge: 'Nou',
        maxGuests: 3,
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        availableFrom: '2026-02-01',
        availableTo: '2026-12-31',
        description: 'O cabană de basm ascunsă în pădurile din Poiana Brașov, perfectă pentru cupluri sau familii mici care caută liniște și natură autentică. Atmosfera caldă, șemineul și grădina privată creează un refugiu perfect.',
        descriptionExtra: 'Cabana dispune de un șemineu funcțional cu lemne incluse, o bucătărie tradițională echipată și o grădină de 300 mp cu grătar și zonă de relaxare. Iarna, accesul la pârtiile de ski este la 10 minute. Vara, traseele montane pornesc chiar din curte.',
        host: 'Mihaela D.',
        amenities: [
            { icon: '🌐', label: 'WiFi', available: true },
            { icon: '🔥', label: 'Șemineu', available: true },
            { icon: '🌿', label: 'Grădină privată', available: true },
            { icon: '🍳', label: 'Bucătărie echipată', available: true },
            { icon: '🅿️', label: 'Parcare', available: true },
            { icon: '❄️', label: 'Aer condiționat', available: true },
            { icon: '🛷', label: 'Acces ski', available: true },
            { icon: '🏊', label: 'Piscină', available: false },
            { icon: '🛁', label: 'Jacuzzi', available: false },
            { icon: '📺', label: 'Smart TV', available: true },
        ],
        occupiedDays: [6, 7, 8, 13, 14, 20, 21, 27, 28],
        reviewsList: [
            { name: 'Cristina B.', date: 'Ianuarie 2026', rating: 5, color: '#059669', text: 'Cabană minunată! Șemineul a creat o atmosferă de poveste. Am venit în doi și a fost o vacanță romantică de neuitat în munți.' },
            { name: 'Florin A.', date: 'Decembrie 2025', rating: 5, color: '#2563eb', text: 'Perfect pentru familie! Copiii au adorat grădina și natura. Mihaela a fost o gazdă excepțională, cu sfaturi utile despre trasee.' },
            { name: 'Teodora N.', date: 'Noiembrie 2025', rating: 4, color: '#d97706', text: 'Cabana este exact ca în descriere — caldă, curată și liniștită. Accesul la pârtii iarna este un mare plus. Recomand!' },
        ],
        nearby: [
            { icon: '⛷️', name: 'Pârtia Ruia', dist: '800 m' },
            { icon: '🌲', name: 'Trasee montane', dist: '0 m' },
            { icon: '🍽️', name: 'Restaurant munte', dist: '500 m' },
            { icon: '🛒', name: 'Magazin local', dist: '1.2 km' },
            { icon: '🏥', name: 'Urgențe Brașov', dist: '14 km' },
            { icon: '✈️', name: 'Aeroport Brașov', dist: '35 km' },
        ],
    },
    {
        id: 4,
        title: 'Vilă de Lux cu Piscină Privată',
        location: 'Constanța, România',
        city: 'Constanța',
        country: 'România',
        address: 'Strada Falezei 14, Constanța',
        price: 399,
        priceOriginal: 520,
        rating: 5.0,
        reviews: 87,
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
        ],
        features: ['WiFi', 'Piscină', 'Jacuzzi'],
        badge: 'Top',
        maxGuests: 6,
        bedrooms: 4,
        bathrooms: 3,
        area: 280,
        availableFrom: '2026-02-01',
        availableTo: '2026-12-31',
        description: 'Descoperă rafinamentul și luxul absolut în această vilă exclusivistă situată pe malul Mării Negre. Proiectată cu atenție la fiecare detaliu, proprietatea îmbină arhitectura modernă cu eleganța mediteraneană.',
        descriptionExtra: 'Piscina privată cu apă sărată, terasa panoramică și grădina de 800 m² cu vegetație mediteraneană oferă un cadru de neuitat. Interiorul decorat cu mobilier italian și finisaje premium include o bucătărie complet echipată, living generos cu șemineu, patru dormitoare spațioase și trei băi de lux. Distanța față de plajă: 150 m.',
        host: 'Maria G.',
        amenities: [
            { icon: '🌐', label: 'WiFi de mare viteză', available: true },
            { icon: '🏊', label: 'Piscină privată', available: true },
            { icon: '🛁', label: 'Jacuzzi', available: true },
            { icon: '🅿️', label: 'Parcare privată', available: true },
            { icon: '❄️', label: 'Aer condiționat', available: true },
            { icon: '🍳', label: 'Bucătărie completă', available: true },
            { icon: '📺', label: 'Smart TV 75"', available: true },
            { icon: '🔥', label: 'Șemineu', available: true },
            { icon: '☀️', label: 'Terasă panoramică', available: true },
            { icon: '🌿', label: 'Grădină privată', available: true },
            { icon: '🐾', label: 'Pet friendly', available: true },
            { icon: '🧺', label: 'Mașină de spălat', available: true },
        ],
        occupiedDays: [5, 6, 7, 8, 12, 13, 19, 20, 27],
        reviewsList: [
            { name: 'Alexandru M.', date: 'Ianuarie 2026', rating: 5, color: '#2563eb', text: 'O experiență absolut fantastică! Vila este exact ca în poze, poate chiar mai frumoasă. Piscina privată este impecabilă, iar vederea de pe terasă este de vis.' },
            { name: 'Ioana P.', date: 'Decembrie 2025', rating: 5, color: '#7c3aed', text: 'Am petrecut 5 zile de neuitat. Totul a fost perfect: curățenia, facilitățile, localizarea. Jacuzzi-ul exterior a fost o surpriză plăcută.' },
            { name: 'Cristian T.', date: 'Noiembrie 2025', rating: 5, color: '#059669', text: 'Vila depășește așteptările. Check-in-ul a fost rapid și simplu, iar proprietara a lăsat un coș de bun venit cu produse locale.' },
        ],
        nearby: [
            { icon: '🏖️', name: 'Plaja Mamaia', dist: '150 m' },
            { icon: '🛒', name: 'Supermarket', dist: '500 m' },
            { icon: '🍽️', name: 'Restaurant', dist: '300 m' },
            { icon: '⛽', name: 'Benzinărie', dist: '1.2 km' },
            { icon: '🏥', name: 'Urgențe', dist: '3.5 km' },
            { icon: '✈️', name: 'Aeroport', dist: '28 km' },
        ],
    },
    {
        id: 5,
        title: 'Studio Cozy în Centrul Vechi',
        location: 'Cluj-Napoca, România',
        city: 'Cluj-Napoca',
        country: 'România',
        address: 'Str. Memorandumului 5, Cluj-Napoca',
        price: 110,
        priceOriginal: 140,
        rating: 4.6,
        reviews: 57,
        images: [
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
        ],
        features: ['WiFi', 'Bucătărie'],
        badge: undefined,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        area: 42,
        availableFrom: '2026-02-01',
        availableTo: '2026-12-31',
        description: 'Studio modern și confortabil în inima Clujului, la 2 minute de Piața Unirii. Ideal pentru cupluri sau călătorii solo care vor să exploreze orașul.',
        descriptionExtra: 'Apartamentul a fost renovat complet în 2024, cu mobilier nou și electrocasnice moderne. Localizarea centrală permite accesul pe jos la principalele atracții, restaurante și cluburi din Cluj.',
        host: 'Bogdan P.',
        amenities: [
            { icon: '🌐', label: 'WiFi fibră optică', available: true },
            { icon: '🍳', label: 'Bucătărie compactă', available: true },
            { icon: '❄️', label: 'Aer condiționat', available: true },
            { icon: '📺', label: 'Smart TV', available: true },
            { icon: '🧺', label: 'Mașină de spălat', available: true },
            { icon: '🅿️', label: 'Parcare stradală', available: false },
            { icon: '🏊', label: 'Piscină', available: false },
            { icon: '☀️', label: 'Terasă', available: false },
        ],
        occupiedDays: [4, 5, 11, 12, 18, 19],
        reviewsList: [
            { name: 'Laura S.', date: 'Ianuarie 2026', rating: 5, color: '#dc2626', text: 'Studio super curat și bine dotat. Localizarea este imbatabilă — am mers pe jos peste tot. Bogdan a răspuns instant la mesaje.' },
            { name: 'Vlad M.', date: 'Decembrie 2025', rating: 4, color: '#2563eb', text: 'Bun pentru prețul plătit. Mic dar bine organizat. Patul este comod, WiFi-ul rapid. Perfect pentru un weekend în Cluj.' },
        ],
        nearby: [
            { icon: '🏛️', name: 'Piața Unirii', dist: '200 m' },
            { icon: '🎓', name: 'Universitate', dist: '400 m' },
            { icon: '🍽️', name: 'Restaurante', dist: '50 m' },
            { icon: '🛒', name: 'Kaufland', dist: '600 m' },
            { icon: '🏥', name: 'Urgențe', dist: '2 km' },
            { icon: '✈️', name: 'Aeroport Cluj', dist: '9 km' },
        ],
    },
    {
        id: 6,
        title: 'Penthouse cu Panoramă la Oraș',
        location: 'Timișoara, România',
        city: 'Timișoara',
        country: 'România',
        address: 'Bulevardul Revoluției 22, Timișoara',
        price: 260,
        priceOriginal: 320,
        rating: 4.9,
        reviews: 42,
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
        ],
        features: ['WiFi', 'Terasă', 'Parcare', 'Jacuzzi'],
        badge: 'Premium',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        area: 150,
        availableFrom: '2026-02-01',
        availableTo: '2026-12-31',
        description: 'Penthouse exclusivist la ultimul etaj al unui imobil boutique din centrul Timișoarei. Terasa de 60 mp cu vedere la 360° asupra orașului oferă un spectacol vizual unic, zi și noapte.',
        descriptionExtra: 'Interiorul combină designul industrial cu eleganța contemporană — tavane înalte, ferestre de podea, finisaje premium. Jacuzzi-ul de pe terasă este disponibil în toate sezoanele. Parcare subterană securizată inclusă.',
        host: 'Dan R.',
        amenities: [
            { icon: '🌐', label: 'WiFi Gigabit', available: true },
            { icon: '🛁', label: 'Jacuzzi terasă', available: true },
            { icon: '☀️', label: 'Terasă 60 mp', available: true },
            { icon: '🅿️', label: 'Parcare subterană', available: true },
            { icon: '❄️', label: 'Aer condiționat', available: true },
            { icon: '🍳', label: 'Bucătărie open-space', available: true },
            { icon: '📺', label: 'Home Cinema', available: true },
            { icon: '🔒', label: 'Smart Lock', available: true },
            { icon: '🏊', label: 'Piscină', available: false },
            { icon: '🐾', label: 'Pet friendly', available: false },
        ],
        occupiedDays: [2, 3, 9, 10, 16, 17, 23, 24],
        reviewsList: [
            { name: 'Oana M.', date: 'Februarie 2026', rating: 5, color: '#059669', text: 'Penthouse-ul este absolut spectaculos! Vederea de pe terasă noaptea este magică. Jacuzzi-ul de afară a fost o experiență de neuitat. Dan este un host perfect.' },
            { name: 'Sorin V.', date: 'Ianuarie 2026', rating: 5, color: '#2563eb', text: 'Cel mai impresionant apartament în care am stat vreodată. Finisajele sunt de 5 stele, terasa enormă, home cinema-ul excelent. Recomand 100%!' },
        ],
        nearby: [
            { icon: '🏛️', name: 'Piața Victoriei', dist: '100 m' },
            { icon: '🎭', name: 'Opera Timișoara', dist: '300 m' },
            { icon: '🍽️', name: 'Restaurante fine dining', dist: '200 m' },
            { icon: '🛒', name: 'Iulius Mall', dist: '2 km' },
            { icon: '🏥', name: 'Spital Județean', dist: '3 km' },
            { icon: '✈️', name: 'Aeroport Timișoara', dist: '15 km' },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_RO = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];

function formatDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d} ${MONTHS_RO[parseInt(m) - 1]} ${y}`;
}

function calcNights(ci: string, co: string) {
    if (!ci || !co) return 0;
    return Math.round((new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 60 * 60 * 24));
}

function onlyDigits(value: string) {
    return value.replace(/\D/g, '');
}

function formatCardNumber(value: string) {
    return onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value: string) {
    const digits = onlyDigits(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidExpiry(value: string) {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;

    const [monthText, yearText] = value.split('/');
    const month = Number(monthText);
    const year = Number(`20${yearText}`);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiryDate = new Date(year, month, 0);
    return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
}

// ─── Component ────────────────────────────────────────────────────────────────

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    const property = useMemo(
        () => {
            const propertyId = Number(id);
            const defaultProperty = PROPERTIES_DB.find((item) => item.id === propertyId);
            if (defaultProperty) return defaultProperty;

            const managedProperty = getManagedPropertyById(propertyId);
            return managedProperty ? toManagedPropertyDetail(managedProperty) : undefined;
        },
        [id]
    );

    // Gallery
    const [lbOpen, setLbOpen] = useState(false);
    const [lbIdx,  setLbIdx]  = useState(0);

    // Description
    const [descExpanded, setDescExpanded] = useState(false);

    // Calendar
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [calYear,  setCalYear]  = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [selStart, setSelStart] = useState<Date | null>(null);
    const [selEnd,   setSelEnd]   = useState<Date | null>(null);
    const [selStep,  setSelStep]  = useState(0);

    // Sidebar
    const todayStr   = today.toISOString().split('T')[0];
    const in3Days    = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const [checkIn,  setCheckIn]  = useState(todayStr);
    const [checkOut, setCheckOut] = useState(in3Days);
    const [guests,   setGuests]   = useState(2);

    // Reviews
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Booking modal
    const [modalOpen,    setModalOpen]    = useState(false);
    const [bookingDone,  setBookingDone]  = useState(false);
    const [bookingCode,  setBookingCode]  = useState('');
    const [bookingPaymentStatus, setBookingPaymentStatus] = useState<'paid' | 'pending'>('paid');
    const [bookingPaymentLabel, setBookingPaymentLabel] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [paymentForm, setPaymentForm] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });
    const [paymentError, setPaymentError] = useState('');

    // Favorites
    const [isFav, setIsFav] = useState(false);

    // ── Redirect if not found
    if (!property) {
        return (
            <div className="home">
                <Header />
                <div className="pd-not-found">
                    <div className="pd-nf-icon">🏠</div>
                    <h2>Proprietatea nu a fost găsită</h2>
                    <p>ID-ul furnizat nu corespunde niciunei proprietăți.</p>
                    <button className="pd-back-btn" onClick={() => navigate('/')}>← Înapoi acasă</button>
                </div>
                <Footer />
            </div>
        );
    }

    // ── Price calc
    const nights   = calcNights(checkIn, checkOut);
    const cleaning = 150;
    const fee      = nights > 0 ? Math.round(property.price * nights * 0.10) : 0;
    const total    = nights > 0 ? property.price * nights + cleaning + fee : 0;
    const discount = Math.round((1 - property.price / property.priceOriginal) * 100);

    // ── Calendar render
    const calDays = useMemo(() => {
        const firstDay = new Date(calYear, calMonth, 1).getDay();
        const offset   = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const cells: { day: number | null; type: string; date: Date | null }[] = [];

        for (let i = 0; i < offset; i++) cells.push({ day: null, type: 'empty', date: null });

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(calYear, calMonth, d);
            let type = 'available';
            if (date < today) type = 'past';
            else if (property.occupiedDays.includes(d)) type = 'occupied';
            else {
                const ts = date.getTime();
                if (selStart && ts === selStart.getTime()) type = 'selected-start';
                else if (selEnd && ts === selEnd.getTime()) type = 'selected-end';
                else if (selStart && selEnd && ts > selStart.getTime() && ts < selEnd.getTime()) type = 'in-range';
                else if (date.toDateString() === today.toDateString()) type = 'today available';
            }
            cells.push({ day: d, type, date });
        }
        return cells;
    }, [calYear, calMonth, selStart, selEnd, property.occupiedDays]);

    const selectDay = useCallback((date: Date) => {
        if (selStep === 0 || selStep === 2) {
            setSelStart(date); setSelEnd(null); setSelStep(1);
        } else {
            if (date <= selStart!) { setSelStart(date); setSelEnd(null); return; }
            setSelEnd(date); setSelStep(2);
            setCheckIn(date > selStart! ? selStart!.toISOString().split('T')[0] : date.toISOString().split('T')[0]);
            setCheckOut(date > selStart! ? date.toISOString().split('T')[0] : selStart!.toISOString().split('T')[0]);
        }
    }, [selStep, selStart]);

    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

    const paymentLabelMap: Record<PaymentMethod, string> = {
        card: 'Card bancar',
        bank_transfer: 'Transfer bancar',
        pay_on_arrival: 'Plată la proprietate',
    };

    const paymentStatusMap: Record<PaymentMethod, 'paid' | 'pending'> = {
        card: 'paid',
        bank_transfer: 'pending',
        pay_on_arrival: 'pending',
    };

    const paymentCtaText =
        paymentMethod === 'card'
            ? `✅ Plătește acum ${formatPrice(total)}`
            : paymentMethod === 'bank_transfer'
                ? '✅ Confirmă și primește detaliile bancare'
                : '✅ Confirmă cu plată la sosire';

    const paymentSummaryText =
        paymentMethod === 'card'
            ? 'Plata este procesată imediat, securizat.'
            : paymentMethod === 'bank_transfer'
                ? 'Rezervarea rămâne în așteptare până la confirmarea transferului.'
                : 'Achiziți la check-in, direct la proprietate.';

    const validatePayment = () => {
        if (paymentMethod !== 'card') return '';

        if (!paymentForm.cardName.trim()) {
            return 'Introdu numele titularului cardului.';
        }

        if (onlyDigits(paymentForm.cardNumber).length !== 16) {
            return 'Numărul cardului trebuie să aibă 16 cifre.';
        }

        if (!isValidExpiry(paymentForm.expiry)) {
            return 'Data de expirare nu este validă.';
        }

        if (onlyDigits(paymentForm.cvv).length < 3) {
            return 'CVV-ul trebuie să aibă 3 sau 4 cifre.';
        }

        return '';
    };

    // ── Booking
    const handleBook = () => {
        if (nights <= 0) return;
        if (!getSession()?.email) {
            navigate('/login');
            return;
        }
        setPaymentError('');
        setBookingDone(false);
        setBookingCode('');
        setModalOpen(true);
    };

    const confirmBooking = () => {
        const session = getSession();
        if (!session?.email) {
            setModalOpen(false);
            navigate('/login');
            return;
        }

        const validationError = validatePayment();
        if (validationError) {
            setPaymentError(validationError);
            return;
        }

        const code = 'SB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const normalizedCard = onlyDigits(paymentForm.cardNumber);
        const paymentStatus = paymentStatusMap[paymentMethod];
        const paymentLabel = paymentLabelMap[paymentMethod];

        saveBooking({
            ownerEmail: session.email,
            propertyId: property.id,
            propertyTitle: property.title,
            propertyLocation: property.location,
            propertyImage: property.images[0],
            checkIn,
            checkOut,
            guests,
            nights,
            total,
            code,
            paymentMethod,
            paymentStatus,
            paymentLabel,
            paymentLast4: paymentMethod === 'card' ? normalizedCard.slice(-4) : undefined,
            paidAt: paymentStatus === 'paid' ? new Date().toISOString() : undefined,
        });

        setPaymentError('');
        setBookingCode(code);
        setBookingPaymentStatus(paymentStatus);
        setBookingPaymentLabel(paymentLabel);
        setBookingDone(true);
    };

    // ── Reviews to show
    const visibleReviews = showAllReviews
        ? property.reviewsList
        : property.reviewsList.slice(0, 3);

    const ratingBars = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: property.reviewsList.filter(r => r.rating === stars).length,
        pct: Math.round((property.reviewsList.filter(r => r.rating === stars).length / property.reviewsList.length) * 100) || 0,
    }));

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="home">
            <Header />

            {/* Breadcrumb */}
            <div className="pd-breadcrumb">
                <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }}>Acasă</a> ›
                <a href="/search" onClick={e => { e.preventDefault(); navigate('/search'); }}>{property.city}</a> ›
                <span>{property.title}</span>
            </div>

            {/* ── Gallery ── */}
            <div className="pd-gallery-wrap">
                <div className="pd-gallery-grid">
                    {property.images.slice(0, 5).map((img, i) => (
                        <div
                            key={i}
                            className={`pd-gallery-item ${i === 0 ? 'pd-gallery-item--main' : ''}`}
                            onClick={() => { setLbIdx(i); setLbOpen(true); }}
                        >
                            <img src={img} alt={`${property.title} ${i + 1}`} loading={i > 0 ? 'lazy' : undefined} />
                        </div>
                    ))}
                </div>
                <button className="pd-gallery-all-btn" onClick={() => { setLbIdx(0); setLbOpen(true); }}>
                    🖼️ Vezi toate fotografiile ({property.images.length})
                </button>
            </div>

            {/* ── Main layout ── */}
            <div className="pd-layout">

                {/* ════ CONTENT COLUMN ════ */}
                <div className="pd-content">

                    {/* Title block */}
                    <div className="pd-title-block">
                        <div className="pd-badges">
                            {property.badge && <span className="pd-badge pd-badge--blue">{property.badge}</span>}
                            <span className="pd-badge pd-badge--green">Disponibilă</span>
                            <span className="pd-badge pd-badge--amber">⚡ Rezervare rapidă</span>
                        </div>
                        <h1>{property.title}</h1>
                        <div className="pd-meta-row">
                            <div className="pd-rating-row">
                                <span className="pd-stars">{'★'.repeat(Math.round(property.rating))}</span>
                                <strong>{property.rating}</strong>
                                <a href="#reviews" className="pd-reviews-link">
                                    {property.reviews} recenzii
                                </a>
                            </div>
                            <span className="pd-dot">·</span>
                            <a href="#map" className="pd-loc-link">📍 {property.location}</a>
                            <span className="pd-dot">·</span>
                            <span className="pd-host">Gazdă: <strong>{property.host}</strong></span>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="pd-quick-stats">
                        <div className="pd-qs-item"><span className="pd-qs-icon">🛏️</span><div><label>Dormitoare</label><strong>{property.bedrooms} camere</strong></div></div>
                        <div className="pd-qs-item"><span className="pd-qs-icon">🚿</span><div><label>Băi</label><strong>{property.bathrooms} băi</strong></div></div>
                        <div className="pd-qs-item"><span className="pd-qs-icon">👥</span><div><label>Capacitate</label><strong>max. {property.maxGuests} pers.</strong></div></div>
                        <div className="pd-qs-item"><span className="pd-qs-icon">📐</span><div><label>Suprafață</label><strong>{property.area} m²</strong></div></div>
                    </div>

                    {/* Description */}
                    <div className="pd-section">
                        <h2 className="pd-sec-title">Despre această proprietate</h2>
                        <p className="pd-desc-text">{property.description}</p>
                        {descExpanded && <p className="pd-desc-text" style={{ marginTop: 10 }}>{property.descriptionExtra}</p>}
                        <button className="pd-read-more" onClick={() => setDescExpanded(p => !p)}>
                            {descExpanded ? 'Citește mai puțin ▲' : 'Citește mai mult ▼'}
                        </button>
                    </div>

                    {/* Amenities */}
                    <div className="pd-section">
                        <h2 className="pd-sec-title">Facilități incluse</h2>
                        <div className="pd-amenities-grid">
                            {property.amenities.map((a, i) => (
                                <div key={i} className={`pd-amenity ${!a.available ? 'pd-amenity--disabled' : ''}`}>
                                    <span>{a.icon}</span>
                                    <span>{a.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="pd-section">
                        <h2 className="pd-sec-title">Disponibilitate</h2>
                        <div className="pd-cal-legend">
                            <div className="pd-cal-leg"><div className="pd-cal-dot pd-cal-dot--range" />Interval selectat</div>
                            <div className="pd-cal-leg"><div className="pd-cal-dot pd-cal-dot--occupied" />Ocupat</div>
                            <div className="pd-cal-leg"><div className="pd-cal-dot pd-cal-dot--free" />Disponibil</div>
                        </div>
                        <div className="pd-calendar">
                            <div className="pd-cal-header">
                                <button className="pd-cal-nav" onClick={prevMonth}>‹</button>
                                <h3>{MONTHS_RO[calMonth]} {calYear}</h3>
                                <button className="pd-cal-nav" onClick={nextMonth}>›</button>
                            </div>
                            <div className="pd-cal-weekdays">
                                {['Lu','Ma','Mi','Jo','Vi','Sâ','Du'].map(d => <span key={d}>{d}</span>)}
                            </div>
                            <div className="pd-cal-days">
                                {calDays.map((cell, i) => (
                                    <div
                                        key={i}
                                        className={`pd-cal-day ${cell.type.split(' ').map(t => `pd-cal-day--${t}`).join(' ')}`}
                                        onClick={() => cell.date && cell.type.includes('available') && selectDay(cell.date)}
                                    >
                                        {cell.day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="pd-section" id="map">
                        <h2 className="pd-sec-title">Localizare</h2>
                        <div className="pd-map-placeholder" onClick={() => alert('Deschide Google Maps în aplicația reală')}>
                            <img
                                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=900&h=380&fit=crop"
                                alt="Hartă"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.65)' }}
                            />
                            <div className="pd-map-overlay">
                                <div className="pd-map-pin">📍</div>
                                <div className="pd-map-label">{property.city}, {property.country}</div>
                                <div className="pd-map-addr">{property.address}</div>
                            </div>
                        </div>
                        <div className="pd-nearby-grid">
                            {property.nearby.map((n, i) => (
                                <div key={i} className="pd-nearby-item">
                                    <span>{n.icon}</span>
                                    <span className="pd-nearby-name">{n.name}</span>
                                    <span className="pd-nearby-dist">{n.dist}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="pd-section" id="reviews">
                        <h2 className="pd-sec-title">Recenzii oaspeți</h2>
                        <div className="pd-reviews-summary">
                            <div className="pd-rs-score">
                                <div className="pd-rs-big">{property.rating.toFixed(1)}</div>
                                <div className="pd-rs-stars">{'★'.repeat(Math.round(property.rating))}</div>
                                <p>{property.reviews} recenzii</p>
                            </div>
                            <div className="pd-rs-bars">
                                {ratingBars.map(b => (
                                    <div key={b.stars} className="pd-rs-bar-row">
                                        <span>{b.stars}</span>
                                        <div className="pd-rs-bar-track">
                                            <div className="pd-rs-bar-fill" style={{ width: `${b.pct}%` }} />
                                        </div>
                                        <span>{b.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pd-reviews-list">
                            {visibleReviews.map((r, i) => (
                                <div key={i} className="pd-review-card">
                                    <div className="pd-rev-header">
                                        <div className="pd-rev-user">
                                            <div className="pd-rev-avatar" style={{ background: r.color }}>
                                                {r.name[0]}
                                            </div>
                                            <div>
                                                <div className="pd-rev-name">{r.name}</div>
                                                <div className="pd-rev-date">{r.date}</div>
                                            </div>
                                        </div>
                                        <div className="pd-rev-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                    </div>
                                    <p className="pd-rev-text">{r.text}</p>
                                </div>
                            ))}
                        </div>
                        {!showAllReviews && property.reviewsList.length > 3 && (
                            <button className="pd-read-more" onClick={() => setShowAllReviews(true)}>
                                Încarcă mai multe recenzii ▼
                            </button>
                        )}
                    </div>

                </div>

                {/* ════ SIDEBAR ════ */}
                <div className="pd-sidebar-col">
                    <div className="pd-sidebar">
                        {/* Price */}
                        <div className="pd-sb-price-row">
                            <span className="pd-sb-price">{formatPrice(property.price)}</span>
                            <span className="pd-sb-per">/ noapte</span>
                            <span className="pd-sb-orig">{formatPrice(property.priceOriginal)}</span>
                            <span className="pd-sb-discount">-{discount}%</span>
                        </div>
                        <div className="pd-sb-rating">
                            <span>{'★'.repeat(Math.round(property.rating))}</span>
                            <strong>{property.rating}</strong>
                            <span>· {property.reviews} recenzii</span>
                        </div>

                        {/* Dates */}
                        <div className="pd-sb-dates">
                            <div className="pd-sb-date-field">
                                <label>CHECK-IN</label>
                                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                            </div>
                            <div className="pd-sb-date-divider" />
                            <div className="pd-sb-date-field">
                                <label>CHECK-OUT</label>
                                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="pd-sb-guests">
                            <div>
                                <label>OASPEȚI</label>
                                <span>{guests} oaspeți</span>
                            </div>
                            <div className="pd-sb-guest-ctrl">
                                <button onClick={() => setGuests(g => Math.max(1, g - 1))} disabled={guests <= 1}>−</button>
                                <span>{guests}</span>
                                <button onClick={() => setGuests(g => Math.min(property.maxGuests, g + 1))} disabled={guests >= property.maxGuests}>+</button>
                            </div>
                        </div>

                        {/* Price breakdown */}
                        {nights > 0 && (
                            <div className="pd-sb-breakdown">
                                <div className="pd-sb-row"><span>{formatPrice(property.price)} × {nights} nopți</span><span>{formatPrice(property.price * nights)}</span></div>
                                <div className="pd-sb-row"><span>Taxă curățenie</span><span>{formatPrice(cleaning)}</span></div>
                                <div className="pd-sb-row"><span>Taxă serviciu (10%)</span><span>{formatPrice(fee)}</span></div>
                                <div className="pd-sb-total"><span>Total</span><span>{formatPrice(total)}</span></div>
                            </div>
                        )}

                        <button className="pd-sb-book-btn" onClick={handleBook} disabled={nights <= 0}>
                            🏨 {nights > 0 ? `Rezervă · ${formatPrice(total)}` : 'Selectează datele'}
                        </button>
                        <p className="pd-sb-note">Nu vei fi taxat încă · Rezervare gratuită</p>

                        <div className="pd-sb-perks">
                            <div className="pd-sb-perk"><span>✅</span>Anulare gratuită 48h</div>
                            <div className="pd-sb-perk"><span>🔒</span>Plată securizată SSL</div>
                            <div className="pd-sb-perk"><span>🎯</span>Confirmare instantanee</div>
                            <div className="pd-sb-perk"><span>💬</span>Suport 24/7</div>
                        </div>

                        <button
                            className={`pd-sb-fav-btn ${isFav ? 'pd-sb-fav-btn--active' : ''}`}
                            onClick={() => setIsFav(f => !f)}
                        >
                            {isFav ? '❤️ Salvat la favorite' : '🤍 Salvează la favorite'}
                        </button>
                    </div>
                </div>

            </div>{/* /pd-layout */}

            {/* ── Lightbox ── */}
            {lbOpen && (
                <div className="pd-lightbox" onClick={e => e.target === e.currentTarget && setLbOpen(false)}>
                    <button className="pd-lb-close" onClick={() => setLbOpen(false)}>✕</button>
                    <img className="pd-lb-img" src={property.images[lbIdx]} alt="" />
                    <div className="pd-lb-nav">
                        <button className="pd-lb-arr" onClick={() => setLbIdx(i => (i - 1 + property.images.length) % property.images.length)}>‹</button>
                        <span className="pd-lb-counter">{lbIdx + 1} / {property.images.length}</span>
                        <button className="pd-lb-arr" onClick={() => setLbIdx(i => (i + 1) % property.images.length)}>›</button>
                    </div>
                </div>
            )}

            {/* ── Booking Modal ── */}
            {modalOpen && (
                <div className="pd-modal-bg" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
                    <div className="pd-modal">
                        <button className="pd-modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        {!bookingDone ? (
                            <>
                                <h2>Confirmă rezervarea</h2>
                                <p className="pd-modal-sub">Verifică detaliile înainte de confirmare</p>
                                <div className="pd-modal-summary">
                                    <img src={property.images[0]} alt={property.title} />
                                    <div>
                                        <h4>{property.title}</h4>
                                        <p>📍 {property.location}</p>
                                        <p>{'★'.repeat(Math.round(property.rating))} {property.rating} · {property.reviews} recenzii</p>
                                    </div>
                                </div>
                                <div className="pd-modal-rows">
                                    <div className="pd-modal-row"><span>Check-in</span><span>{formatDate(checkIn)}</span></div>
                                    <div className="pd-modal-row"><span>Check-out</span><span>{formatDate(checkOut)}</span></div>
                                    <div className="pd-modal-row"><span>Nopți</span><span>{nights}</span></div>
                                    <div className="pd-modal-row"><span>Oaspeți</span><span>{guests} persoane</span></div>
                                    <div className="pd-modal-row"><span>{formatPrice(property.price)} × {nights} nopți</span><span>{formatPrice(property.price * nights)}</span></div>
                                    <div className="pd-modal-row"><span>Taxă curățenie</span><span>{formatPrice(cleaning)}</span></div>
                                    <div className="pd-modal-row"><span>Taxă serviciu</span><span>{formatPrice(fee)}</span></div>
                                </div>
                                <div className="pd-payment-box">
                                    <div className="pd-payment-head">
                                        <h3>Metodă de plată</h3>
                                        <span>{paymentSummaryText}</span>
                                    </div>

                                    <div className="pd-payment-methods">
                                        <button
                                            type="button"
                                            className={`pd-payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                                            onClick={() => { setPaymentMethod('card'); setPaymentError(''); }}
                                        >
                                            <strong>💳 Card</strong>
                                            <span>Visa / Mastercard</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`pd-payment-method ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}
                                            onClick={() => { setPaymentMethod('bank_transfer'); setPaymentError(''); }}
                                        >
                                            <strong>🏦 Transfer</strong>
                                            <span>Confirmare ulterioară</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`pd-payment-method ${paymentMethod === 'pay_on_arrival' ? 'active' : ''}`}
                                            onClick={() => { setPaymentMethod('pay_on_arrival'); setPaymentError(''); }}
                                        >
                                            <strong>🏨 La sosire</strong>
                                            <span>Plătești la check-in</span>
                                        </button>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="pd-payment-fields">
                                            <div className="pd-payment-field pd-payment-field--full">
                                                <label>Titular card</label>
                                                <input
                                                    type="text"
                                                    value={paymentForm.cardName}
                                                    onChange={(e) => {
                                                        setPaymentForm((prev) => ({ ...prev, cardName: e.target.value }));
                                                        setPaymentError('');
                                                    }}
                                                    placeholder="Prenume Nume"
                                                />
                                            </div>
                                            <div className="pd-payment-field pd-payment-field--full">
                                                <label>Număr card</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={paymentForm.cardNumber}
                                                    onChange={(e) => {
                                                        setPaymentForm((prev) => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }));
                                                        setPaymentError('');
                                                    }}
                                                    placeholder="4242 4242 4242 4242"
                                                />
                                            </div>
                                            <div className="pd-payment-field">
                                                <label>Expiră</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={paymentForm.expiry}
                                                    onChange={(e) => {
                                                        setPaymentForm((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }));
                                                        setPaymentError('');
                                                    }}
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div className="pd-payment-field">
                                                <label>CVV</label>
                                                <input
                                                    type="password"
                                                    inputMode="numeric"
                                                    value={paymentForm.cvv}
                                                    onChange={(e) => {
                                                        setPaymentForm((prev) => ({ ...prev, cvv: onlyDigits(e.target.value).slice(0, 4) }));
                                                        setPaymentError('');
                                                    }}
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="pd-payment-note">
                                            <strong>IBAN demo:</strong> MD12STBK0000000001234567
                                            <br />
                                            <strong>Beneficiar:</strong> StayBooker SRL
                                        </div>
                                    )}

                                    {paymentMethod === 'pay_on_arrival' && (
                                        <div className="pd-payment-note">
                                            Rezervarea se confirmă acum, iar plata se face direct la recepție sau la gazdă în ziua check-in-ului.
                                        </div>
                                    )}

                                    {paymentError && <div className="pd-payment-error">{paymentError}</div>}
                                </div>
                                <div className="pd-modal-total"><span>Total de plată</span><span>{formatPrice(total)}</span></div>
                                <button className="pd-modal-confirm-btn" onClick={confirmBooking}>
                                    {paymentCtaText}
                                </button>
                            </>
                        ) : (
                            <div className="pd-modal-success">
                                <div>🎉</div>
                                <h3>Rezervare confirmată!</h3>
                                <p>
                                    {bookingPaymentStatus === 'paid'
                                        ? `Plata prin ${bookingPaymentLabel.toLowerCase()} a fost înregistrată cu succes.`
                                        : `Rezervarea a fost creată cu metoda ${bookingPaymentLabel.toLowerCase()} și așteaptă confirmarea finală.`}
                                </p>
                                <div className="pd-modal-code">{bookingCode}</div>
                                <p className="pd-modal-code-label">Cod de confirmare · Salvează-l pentru referință</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default PropertyDetail;
