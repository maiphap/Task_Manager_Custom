import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from "./Redux/Store";
import {Provider} from "react-redux";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import '@atlaskit/css-reset';
import './Components/Modals/EditCardModal/Popovers/Date/DateRange.css';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "replace_with_your_google_client_id"}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);