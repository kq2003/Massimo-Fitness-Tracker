import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getAerobicProgress } from '../api';
import { ChartOptions } from 'chart.js';

interface AerobicProgressPlotProps {
    exerciseType: string;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        tension: number;
        yAxisID: string;
    }[];
    details: Record<string, SessionDetail[]>;
}

interface SessionDetail {
    duration: number;
    calories_burnt: number;
    heart_rate: number;
}

const AerobicProgressPlot: React.FC<AerobicProgressPlotProps> = ({ exerciseType }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [selectedDateDetails, setSelectedDateDetails] = useState<SessionDetail[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAerobicProgress(exerciseType);
                const { dates, durations, details } = response.data;

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: `${exerciseType} - Duration (minutes)`,
                            data: durations,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.3,
                            yAxisID: 'y-axis-duration',
                        },
                    ],
                    details,
                });
            } catch (error) {
                console.error('Error fetching aerobic data:', error);
            }
        };

        fetchData();
    }, [exerciseType]);


    const options: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            y: { // Using 'y' instead of a custom name like 'yAxisDuration'
                type: 'linear', // This should be an explicit literal, not just 'string'
                position: 'left',
                title: {
                    display: true,
                    text: 'Duration (minutes)',
                },
            },
        },
        plugins: {
            tooltip: { enabled: true },
        },
        onClick: (event: any, elements: any[]) => {
            if (elements.length > 0 && chartData) {
                const index = elements[0].index;
                const selectedDate = chartData.labels[index];
                setSelectedDateDetails(chartData.details[selectedDate]);
            }
        },
    };

    

    return (
        <div>
            <h3>{exerciseType} Duration Over Time</h3>
            {chartData ? (
                <>
                    <Line data={chartData} options={options} />
                    {selectedDateDetails && (
                        <div className="mt-4">
                            <h4>Details for {selectedDate}</h4>
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
};

export default AerobicProgressPlot;
