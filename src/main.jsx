import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CitizenProvider } from './context/CitizenContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CitizenProvider>
      <App />
    </CitizenProvider>
  </React.StrictMode>
);
