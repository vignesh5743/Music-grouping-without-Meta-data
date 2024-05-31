import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, message } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';

const ClusterResult = () => {
  const [clusterData, setClusterData] = useState(null);

  useEffect(() => {
    const fetchClusterData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cluster');
        setClusterData(response.data);
      } catch (error) {
        console.error('Error fetching cluster data:', error);
      }
    };

    fetchClusterData();
  }, []);

  const DownloadZipButton = () => {
    const downloadZip = async () => {
      try {
        const response = await axios.get('http://localhost:5000/download-zip', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '11/output.zip');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading zip file:', error);
      }
    };

    return (
      <Button type="primary" icon={<DownloadOutlined />} onClick={downloadZip} style={{ marginRight: '10px' }}>
        Download Zip
      </Button>
    );
  };

  const clearAll = async () => {
    try {
      await axios.post('http://localhost:5000/clear-all');
      message.success('All items in cluster folder have been deleted');
    } catch (error) {
      console.error('Error clearing items:', error);
      message.error('Failed to clear items');
    }
  };

  const renderClusterData = () => {
    if (!clusterData) return null;

    return Object.keys(clusterData).map((clusterIndex) => (
      <div key={clusterIndex} style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Shell', fontSize: '32px', fontWeight: 'bold' }}>Cluster {clusterIndex}:</h2>
        {clusterData[clusterIndex].map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    ));
  };

  return (
    <div style={{ backgroundColor: 'bisque', minHeight: '100vh', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Script MT Bold', fontSize: '36px' }}>Cluster Result</h1>
        {renderClusterData()}
        <div style={{ marginBottom: '10px' }}>
          <DownloadZipButton />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={clearAll}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClusterResult;
