// src/UploadPage.js

import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('http://localhost:5000/upload', formData);

      // Optionally, you can handle the response (e.g., show a success message)
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <h1>Upload</h1>
      <form id="upload-form">
        <label htmlFor="file">Select file:</label>
        <input type="file" id="file" name="file" onChange={handleFileChange} required />
        <br />
        <button type="submit" onClick={handleSubmit}>Upload</button>
      </form>
    </div>
  );
};

export default UploadPage;
