import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserAuth from './components/UserAuth';
import Menu from './pages/Menu';  // Main menu after login
import QueryData from './pages/QueryData';  // Placeholder for data visualization
import AddSession from './pages/AddSession';  // Placeholder for adding workout sessions
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <Router>
            <Routes>
                {/* Default login page */}
                <Route path="/" element={<UserAuth />} />

                {/* Menu page after login */}
                <Route path="/menu" element={<Menu />} />

                {/* Query Data page for interactive visualizations */}
                <Route path="/query-data" element={<QueryData />} />

                {/* Add Session page for adding workouts */}
                <Route path="/add-session" element={<AddSession />} />
            </Routes>
        </Router>
    );
}

export default App;


