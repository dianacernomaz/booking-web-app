import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./Scrolltotop";
import Home from "./Home";
import SearchResults from "./SearchResults";
import Login from "./Login";
import Register from "./Register";
import PropertyDetail from "./Propertydetail";
import MyProfile from "./MyProfile";
import MyBookings from "./MyBookings";
import "./CSS/App.css";

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/search"       element={<SearchResults />} />
                <Route path="/login"        element={<Login />} />
                <Route path="/register"     element={<Register />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/profile"      element={<MyProfile />} />
                <Route path="/bookings"     element={<MyBookings />} />
            </Routes>
        </>
    );
}

export default App;