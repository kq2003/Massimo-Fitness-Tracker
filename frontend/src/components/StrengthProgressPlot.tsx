import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { getStrengthProgress } from '../api';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface StrengthProgressPlotProps {
    exerciseType: string;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        tension: number;
        yAxisID?: string;
        hidden?: boolean;
    }[];
    details: Record<string, SetDetail[]>;
}

interface SetDetail {
    weight: number;
    reps: number;
    rest_time: number;
    effort_level: string;
}

const StrengthProgressPlot: React.FC<StrengthProgressPlotProps> = ({ exerciseType }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedDateDetails, setSelectedDateDetails] = useState<SetDetail[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStrengthProgress(exerciseType);
                const { dates, first_set_weights, first_set_reps, total_volumes, details } = response.data;

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: `${exerciseType} - First Set Weight`,
                            data: first_set_weights,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1,
                            yAxisID: 'y-axis-weight',
                        },
                        {
                            label: `${exerciseType} - First Set Reps`,
                            data: first_set_reps,
                            borderColor: 'rgba(192, 75, 75, 1)',
                            tension: 0.1,
                            yAxisID: 'y-axis-reps',
                        },
                        {
                            label: `${exerciseType} - Total Volume`,
                            data: total_volumes,
                            borderColor: 'rgba(75, 75, 192, 1)',
                            tension: 0.1,
                            hidden: true,
                        },
                    ],
                    details,
                });
            } catch (error) {
                console.error("Error fetching exercise data:", error);
            }
        };

        fetchData();
    }, [exerciseType]);

    const options = {
        responsive: true,
        scales: {
            'y-axis-weight': {
                type: 'linear' as const, // Explicitly define as "linear"
                position: 'left' as const, // Explicitly define as "left"
                title: { display: true, text: 'Weight (kg)' },
            },
            'y-axis-reps': {
                type: 'linear' as const, // Explicitly define as "linear"
                position: 'right' as const, // Explicitly define as "right"
                title: { display: true, text: 'Reps' },
            },
        },
        plugins: {
            tooltip: { enabled: true },
            legend: { display: true, position: 'top' as const }, // Explicitly define as "top"
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
            <h3>{exerciseType} Progress Over Time</h3>
            {chartData ? (
                    <>
                    <Line data={chartData} options={options} />
                    {selectedDate && selectedDateDetails && (
                        <div className="mt-4">
                            <h4>Details for {selectedDate}</h4>
                            <ul>
                                {selectedDateDetails.map((set, index) => (
                                    <li key={index}>
                                        <strong>Set {index + 1}:</strong> {set.weight} kg, {set.reps} reps, {set.rest_time} sec rest, Effort: {set.effort_level}
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

export default StrengthProgressPlot;
