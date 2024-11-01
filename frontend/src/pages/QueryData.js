import React from 'react';
import { useNavigate } from 'react-router-dom';

function QueryData() {
    const navigate = useNavigate();

    const goToMenu = () => {
        navigate('/menu');
    };

    return (
        <div>
            <h1>Query Data Page</h1>
            <p>This is where interactive data visualizations will be implemented.</p>
            <button onClick={goToMenu}>Back to Menu</button>
        </div>
    );
}

export default QueryData;
