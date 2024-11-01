// import React from 'react';
// import WorkoutForm from './components/WorkoutForm';

// function App() {
//     return (
//         <div className="App">
//             <WorkoutForm />
//         </div>
//     );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutForm from './components/WorkoutForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WorkoutForm />} />
            </Routes>
        </Router>
    );
}

export default App;

