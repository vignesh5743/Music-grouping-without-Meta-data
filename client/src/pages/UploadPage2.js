import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import './style.css';

const UploadPage2 = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files)); // Convert FileList to Array
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
 
    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

      const response = await axios.post('http://localhost:5000/upload2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Files uploaded successfully');
      setUploadedFiles(response.data.files || []);
      window.location.href = "/ClusterResult";
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      <header>
        <h1>Upload Music for Clustering</h1>
      </header>
      <div className="container">
        <h1>Upload</h1>
        <form id="upload-form">
          <label htmlFor="file">Select files:</label>
          <input type="file" id="file" name="file" accept="audio/*" onChange={handleFileChange} multiple required />
          <br />
          <Button type="primary" style={{ margin: '10px auto' }} onClick={handleSubmit}>
            Upload <CloudUploadOutlined style={{ marginLeft: '10px' }} />
          </Button>
        </form>

        {selectedFiles.length > 0 && (
          <div>
            <h2>Selected Files:</h2>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div>
            <h2>Uploaded Documents:</h2>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.filename}</li> // Assuming 'filename' is the property containing the file name
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer>
        <div className="footer-content">
          <p>&copy; 2024 Music Classification App. All rights reserved.</p>
          <ul className="footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage2;
