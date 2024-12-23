'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import Papa from 'papaparse'; // Add PapaParse to parse CSV
import styles from '../../styles/Home.module.css'; 

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const Home = () => {
  const [climateData, setClimateData] = useState<any[]>([]);
  const [selectedDataType, setSelectedDataType] = useState<string>('Density'); // Default to 'Density'
  
  // Fetch and parse data
  useEffect(() => {
    axios.get('/api/worlddata', { responseType: 'text' }) // Ensure response is treated as text
      .then((response) => {
        const parsedData = Papa.parse(response.data, {
          header: true, // Ensures the first row is used as headers
          skipEmptyLines: true,
        });
        setClimateData(parsedData.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle change in selected data type
  const handleDataTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value);
  };

  // Extract the data for the selected type
  const countries = climateData.map((data) => data.Country); // Countries as x-axis labels
  const dataTypes = climateData.map((data) => parseFloat(data[selectedDataType])); // Ensure data is parsed as numbers

  // Prepare chart data dynamically based on selected data type
  const chartData = {
    labels: countries, // Countries as labels for the x-axis
    datasets: [{
      label: selectedDataType, // Dynamic label based on selected data type
      data: dataTypes, // Dynamic y-values based on selected data
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Country vs. ${selectedDataType}`, // Title dynamically changes
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Ensures no labels are skipped
          maxRotation: 90, // Rotates the labels to fit more
          minRotation: 90,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.container}>
      <h1>Global Data Analysis</h1>

      {/* Dropdown to select data type */}
      <select value={selectedDataType} onChange={handleDataTypeChange}>
        <option value="Density">Population Density</option>
        <option value="Agricultural Land">Agricultural Land (%)</option>
        <option value="Land Area">Land Area (Km²)</option>
        <option value="Armed Forces size">Armed Forces Size</option>
        <option value="Birth Rate">Birth Rate</option>
        <option value="Co2-Emissions">CO2 Emissions (tons)</option>
      </select>

      {/* Display the chart */}
      <div style={{ width: '100%', height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Home;
