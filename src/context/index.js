import { SnackbarProvider } from 'notistack';
import React from 'react';
import { NetworkProvider } from './useNetwork';

const AppProvider = ({ children }) => {
  return (
    <SnackbarProvider>
      <NetworkProvider>{children}</NetworkProvider>
    </SnackbarProvider>
  );
};

export default AppProvider;
