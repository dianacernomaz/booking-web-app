import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./Scrolltotop";
import Home from "./Home";
import SearchResults from "./SearchResults";
import Login from "./Login";
import Register from "./Register";
import PropertyDetail from "./Propertydetail";
import MyProfile from "./MyProfile";
import MyBookings from "./MyBookings";
import Admin from "./Admin";
import AdminCazari from "./AdminCazari";
import AdminEditCazare from "./AdminEditCazare";
import ProtectedRoute from "./router/ProtectedRoute";
import Error401Page from "./pages/errors/Error401Page";
import Error403Page from "./pages/errors/Error403Page";
import Error404Page from "./pages/errors/Error404Page";
import Error500Page from "./pages/errors/Error500Page";
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
                <Route
                    path="/profile"
                    element={(
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/bookings"
                    element={(
                        <ProtectedRoute>
                            <MyBookings />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin"
                    element={(
                        <ProtectedRoute requiredRole="admin">
                            <Admin />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/cazari"
                    element={(
                        <ProtectedRoute requiredRole="admin">
                            <AdminCazari />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/cazari/:id"
                    element={(
                        <ProtectedRoute requiredRole="admin">
                            <AdminEditCazare />
                        </ProtectedRoute>
                    )}
                />
                <Route path="/401" element={<Error401Page />} />
                <Route path="/403" element={<Error403Page />} />
                <Route path="/500" element={<Error500Page />} />
                <Route path="*" element={<Error404Page />} />
            </Routes>
        </>
    );
}

export default App;
