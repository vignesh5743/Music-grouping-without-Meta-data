// src/components/Predictions.js

import React, { useState } from 'react';
import axios from 'axios';
import Result from './Result'; // Import the Result component

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);

  const handlePredictAll = async () => {
    try {
      const response = await axios.get('/predict_all_songs'); // Fetch predictions from the new endpoint
      setPredictions(response.data.predictions); // Set predictions from the response
    } catch (error) {
      console.error('Error fetching prediction results:', error);
    }
  };

  return (
    <div>
      <h1>Predictions</h1>
      <button onClick={handlePredictAll}>Predict All</button>
      <Result predictions={predictions} /> {/* Pass predictions to the Result component */}
    </div>
  );
};

export default Predictions;
