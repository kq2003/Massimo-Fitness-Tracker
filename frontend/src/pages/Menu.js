import React from 'react';
import { useNavigate } from 'react-router-dom';

function Menu() {
    const navigate = useNavigate();

    const handleQueryData = () => {
        navigate('/query-data');
    };

    const handleAddSession = () => {
        navigate('/add-session');
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div>
            <h1>Menu</h1>
            <button onClick={handleQueryData}>Query Data</button>
            <button onClick={handleAddSession}>Add a Session</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Menu;
