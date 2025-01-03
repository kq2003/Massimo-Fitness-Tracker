import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { Modal, Button } from "react-bootstrap"; // For the popup
import { getStrengthProgress } from "../api";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

function StrengthProgressPlot({ exerciseType }) {
  const [chartData, setChartData] = useState(null);
  const [selectedDateDetails, setSelectedDateDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStrengthProgress(exerciseType); // Fetches data from workout_progress
        const { dates, first_set_weights, first_set_reps, details } = response.data;

        setChartData({
          labels: dates,
          datasets: [
            {
              label: `${exerciseType} - First Set Weight`,
              data: first_set_weights,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
              yAxisID: "y-axis-weight",
            },
            {
              label: `${exerciseType} - First Set Reps`,
              data: first_set_reps,
              borderColor: "rgba(192, 75, 75, 1)",
              tension: 0.1,
              yAxisID: "y-axis-reps",
            },
          ],
          details: details,
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
      "y-axis-weight": {
        type: "linear",
        position: "left",
        title: { display: true, text: "Weight (kg)" },
      },
      "y-axis-reps": {
        type: "linear",
        position: "right",
        title: { display: true, text: "Reps" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
    plugins: {
      tooltip: { enabled: true },
      legend: { display: true, position: "top" },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selectedDate = chartData.labels[index];
        setSelectedDateDetails({ date: selectedDate, details: chartData.details[selectedDate] });
        setModalVisible(true);
      }
    },
  };

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div>
      <h3>{exerciseType} Progress Over Time</h3>
      {chartData ? (
        <>
          <Line data={chartData} options={options} />
          <Modal show={modalVisible} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Workout Details - {selectedDateDetails?.date}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedDateDetails?.details ? (
                <ul>
                  {selectedDateDetails.details.map((set, index) => (
                    <li key={index}>
                      <strong>Set {index + 1}:</strong> {set.weight} kg, {set.reps} reps, {set.rest_time} sec rest, Effort:{" "}
                      {set.effort_level}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No details available for this date.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StrengthProgressPlot;




