import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './page'; // Import your main App component

// Function to fetch and apply styles within the Shadow DOM
const fetchAndApplyStyles = async (shadowRoot: ShadowRoot) => {
  try {
    const response = await fetch('../globals.css'); // Ensure this path is correct
    const cssText = await response.text();
    const styleElement = document.createElement('style');
    styleElement.textContent = cssText;
    shadowRoot.appendChild(styleElement);
  } catch (error) {
    console.error('Failed to load global styles:', error);
  }
};

const initShadowDom = () => {
  const container = document.createElement('div');
  container.id = 'ollabot-copilot';
  document.body.appendChild(container);

  const shadowContainer = container.attachShadow({ mode: 'open' });
  const shadowRootElement = document.createElement('div');
  shadowContainer.appendChild(shadowRootElement);

  const cache = createCache({
    key: 'css',
    prepend: true,
    container: shadowContainer,
  });

  const theme = createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
    },
  });

  fetchAndApplyStyles(shadowContainer).then(() => {
    ReactDOM.createRoot(shadowRootElement).render(
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </CacheProvider>
    );
  });
};

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    initShadowDom();
  }
});
