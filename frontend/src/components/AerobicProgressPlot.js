import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getAerobicProgress } from '../api';  // Define this API call to fetch aerobic data

function AerobicProgressPlot({ exerciseType }) {
    const [chartData, setChartData] = useState(null);
    const [selectedDateDetails, setSelectedDateDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAerobicProgress(exerciseType);  // Fetches data from the backend
                const { dates, durations, details } = response.data;

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: `${exerciseType} - Duration (minutes)`,
                            data: durations,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.3,
                            yAxisID: 'y-axis-duration'
                        }
                    ],
                    details: details
                });
            } catch (error) {
                console.error("Error fetching aerobic data:", error);
            }
        };

        fetchData();
    }, [exerciseType]);

    const options = {
        responsive: true,
        scales: {
            'y-axis-duration': {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Duration (minutes)'
                }
            }
        },
        plugins: {
            tooltip: { enabled: true }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selectedDate = chartData.labels[index];
                setSelectedDateDetails(chartData.details[selectedDate]);
            }
        }
    };

    return (
        <div>
            <h3>{exerciseType} Duration Over Time</h3>
            {chartData ? (
                <>
                    <Line data={chartData} options={options} />
                    {selectedDateDetails && (
                        <div className="mt-4">
                            <h4>Details for {chartData.labels[chartData.labels.indexOf(selectedDateDetails)]}</h4>
                            <ul>
                                {selectedDateDetails.map((session, index) => (
                                    <li key={index}>
                                        <strong>Session {index + 1}:</strong> {session.duration} min, {session.calories_burnt} kcal, HR: {session.heart_rate}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default AerobicProgressPlot;
