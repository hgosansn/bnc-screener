import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { createRoot } from 'react-dom/client';
const darkTheme = createTheme({
	palette: {
	mode: 'dark',
	},
});

createRoot(document.getElementById('root')).render(
	<App />
);