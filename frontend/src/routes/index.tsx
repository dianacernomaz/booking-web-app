import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PropertyDetail from "../pages/PropertyDetail";
import MyProfile from "../pages/MyProfile";
import MyBookings from "../pages/MyBookings";
import MyProperties from "../pages/MyProperties";
import Wishlist from "../pages/Wishlist";
import AdminDashboard from "../pages/AdminDashboard";
import Features from "../pages/Features";
import About from "../pages/About";
import ErrorPage from "../pages/ErrorPage";

export default function Router() {
    return (
        <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/search"       element={<SearchResults />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/profile"      element={<MyProfile />} />
            <Route path="/bookings"     element={<MyBookings />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/wishlist"     element={<Wishlist />} />
            <Route path="/admin"        element={<AdminDashboard />} />
            <Route path="/features"     element={<Features />} />
            <Route path="/about"        element={<About />} />
            
            {/* Error Pages */}
            <Route path="/401" element={<ErrorPage code={401} title="Neautorizat" message="Trebuie sa fii autentificat pentru a accesa aceasta pagina." />} />
            <Route path="/403" element={<ErrorPage code={403} title="Acces Interzis" message="Nu ai permisiunile necesare pentru a vedea aceasta pagina." />} />
            <Route path="/500" element={<ErrorPage code={500} title="Eroare Server" message="Ceva nu a mers bine la noi. Te rugam sa incerci mai tarziu." />} />
            <Route path="*" element={<ErrorPage code={404} title="Pagina Negasita" message="Pagina pe care o cauti nu exista sau a fost mutata." />} />
        </Routes>
    );
}
