import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { ForwardOutlined } from '@ant-design/icons';

const Result = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/predict_all_songs');
        setPredictions(response.data.predictions);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();
  }, []);

  const handleClassifyMore = async () => {
    try {
      await axios.post('http://localhost:5000/classify_more');
      window.location.href = '/upload';
    } catch (error) {
      console.error('Error classifying more:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'bisque', display: 'flex', flexDirection: 'column', minHeight: '100vh', textAlign: 'center', fontFamily: 'Script MT Bold', fontSize: '32px' }}>
      <h1 style={{ margin: '0', marginBottom: '10px' }}>Prediction Results</h1>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {predictions.map((prediction, index) => (
          <li key={index} style={{ marginBottom: '5px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: 'Shell', fontSize: '28px', margin: '5px 0' }}>Song: {prediction.file_name}</p>
            <p style={{ fontFamily: 'Shell', fontSize: '28px', margin: '5px 0' }}>Director: {prediction.predicted_class}</p>
          </li>
        ))}
      </ul>
      <Button style={{ margin: '10px auto' }} type="primary" onClick={handleClassifyMore}>
        Classify More <ForwardOutlined style={{ marginLeft: '10px' }} />
      </Button>
    </div>
  );
};

export default Result;
