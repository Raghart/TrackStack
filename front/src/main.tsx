import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import store from './store.ts';
import App from './App.tsx';
import { ColorModeProvider } from './components/ui/color-mode.tsx';
import theme from './theme.ts';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient.ts';
import "./fonts/fonts.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <Provider store={store}>
        <Router>
          <ColorModeProvider>
            <ApolloProvider client={client}>
              <App />
            </ApolloProvider>
          </ColorModeProvider>
        </Router>
      </Provider>
    </ChakraProvider>
  </StrictMode>,
);
