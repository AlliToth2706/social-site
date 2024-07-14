import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initialise } from './Data/accounts';

// Initialises the localstorage data
initialise();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);
