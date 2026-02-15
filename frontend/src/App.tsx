import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import SearchResults from "./SearchResults";
import "./App.css";
import Auth from "./Auth";

<Route path="/auth" element={<Auth />} />

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
        </Routes>
    );
}

export default App;
