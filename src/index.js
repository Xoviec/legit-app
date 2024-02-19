import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Main} from './Main'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserSessionProvider } from './components/Context/Context';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserSessionProvider>
        <QueryClientProvider client={queryClient}>
          <Main/>
      </QueryClientProvider>
    </UserSessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
