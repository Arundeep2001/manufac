import React from 'react';
import { MantineProvider } from '@mantine/core';
import MainComponent from './Components/MainComponent/MainComponent';
import './App.css'

const App: React.FC = () => {
  return (
    <MantineProvider >
      <div style={{textAlign:'center'}}>
        <h1>Manufac Assignment</h1>
        <MainComponent />
      </div>
    </MantineProvider>
  );
};

export default App;
