'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';  // Import PointElement
import styles from '../../styles/Home.module.css';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);  // Register PointElement

const Home = () => {
  const [climateData, setClimateData] = useState<any[] | null>(null);

  useEffect(() => {
    axios.get("/api/worlddata")  // Fetch data from the API route
      .then((response) => {
        setClimateData(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  if (!climateData) return <div>Loading...</div>;

  const countries = climateData.map((data: any) => data.Country);
  const populations = climateData.map((data: any) => data.Population);

  const chartData = {
    labels: countries,
    datasets: [{
      label: 'Population by Country',
      data: populations,
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }],
  };

  return (
    <div className={styles.container}>
      <h1>World Data - Population by Country</h1>
      <Line data={chartData} />
    </div>
  );
};

export default Home;
