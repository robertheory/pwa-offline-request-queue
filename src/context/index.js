import React from 'react';
import { NetworkProvider } from './useNetwork';

const AppProvider = ({ children }) => {
  return <NetworkProvider>{children}</NetworkProvider>;
};

export default AppProvider;
