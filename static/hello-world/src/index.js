import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Config from './Config';
import ForgeReconciler from "@forge/react";
import '@atlaskit/css-reset';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

ForgeReconciler.addConfig(<Config />);
