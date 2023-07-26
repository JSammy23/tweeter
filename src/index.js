import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from "styled-components";
import theme from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from 'services/appContext';
import { ThreadProvider } from 'services/ThreadContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <AppProvider>
        <ThreadProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThreadProvider>
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);


