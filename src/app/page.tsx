'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import * as XLSX from 'xlsx'; // Import xlsx to parse Excel data
import styles from '../../styles/Home.module.css';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const Home = () => {
  const [climateData, setClimateData] = useState<any[]>([]);
  const [selectedDataType, setSelectedDataType] = useState<string>('Density'); // Default to 'Density'
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]); // Store dynamic dropdown options

  // Fetch and parse cleaned Excel data
  useEffect(() => {
    axios.get('/cleaned_world_data.xlsx', { responseType: 'arraybuffer' }) // Fetch the Excel file as arraybuffer
      .then((response) => {
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assuming the first sheet is the one you need
        const sheet = workbook.Sheets[sheetName];

        // Parse the sheet into JSON format
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 for the first row as headers
        const header = parsedData[0]; // Get the headers
        const dataRows = parsedData.slice(1); // Get the actual data

        // Map the data into an object array
        const formattedData = dataRows.map((row: any) => {
          const rowObject: { [key: string]: any } = {};
          row.forEach((value: any, index: number) => {
            rowObject[header[index]] = value;
          });
          return rowObject;
        });

        setClimateData(formattedData);
        setDropdownOptions(header.filter((h: string) => h !== 'Country')); // Exclude 'Country' from dropdown
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle change in selected data type
  const handleDataTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value);
  };

  // Extract and clean the data for the selected type
  const countries = climateData.map((data) => data.Country); // Countries as x-axis labels
  const dataTypes = climateData.map((data) => parseFloat(data[selectedDataType])); // Ensure data is parsed as numbers

  // Filter out invalid data (e.g., NaN or undefined) for the selected data type
  const validData = countries
    .map((country, index) => ({
      country,
      value: dataTypes[index],
    }))
    .filter((item) => !isNaN(item.value) && item.value !== null);

  // Prepare chart data dynamically based on the selected data type
  const chartData = {
    labels: validData.map((item) => item.country), // Use valid countries for the x-axis
    datasets: [{
      label: selectedDataType, // Dynamic label based on selected data type
      data: validData.map((item) => item.value), // Dynamic y-values based on valid data
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
          autoSkip: true, // Automatically skip labels if necessary
          maxTicksLimit: 15, // Limit the number of x-axis labels displayed
          maxRotation: 90,
          minRotation: 45,
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
        {dropdownOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Display the chart */}
      <div style={{ width: '100%', height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Home;
