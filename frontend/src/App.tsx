import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import SearchResults from "./SearchResults";
import Login from "./Login";
import Register from "./Register";
import PropertyDetail from "./Propertydetail";
import "./CSS/App.css";

function App() {
    return (
        <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/search"        element={<SearchResults />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/property/:id"  element={<PropertyDetail />} />
        </Routes>
    );
}

export default App;