import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Homepage';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <Router>
      <TaskProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;