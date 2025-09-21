import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Initialize Capacitor if available
if (typeof window !== 'undefined' && (window as any).Capacitor) {
  console.log('Running in Capacitor context');
  // Additional Capacitor initialization can go here
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);