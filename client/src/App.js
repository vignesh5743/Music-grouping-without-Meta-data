// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import Result from './components/Result';
import ClusterResult from './components/clusterResult';
import UploadPage2 from './pages/UploadPage2';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import SignUpForm from './pages/SignUpForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LoginForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/upload2" element={<UploadPage2 />} />
        <Route path="/Result" element={<Result/>}/>
        <Route path="/ClusterResult" element={<ClusterResult/>}/>
        <Route path="/Login" element={<LoginForm/>} />
        <Route path="/Signup" element={<SignUpForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
