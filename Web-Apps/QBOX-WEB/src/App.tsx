// src/App.tsx
import React from 'react';
import RoutesConfig from './routes/Routes';
import ErrorBoundary from '@components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <RoutesConfig /> {/* Render the routes */}
      </div>
    </ErrorBoundary>
  );
};

export default App;
