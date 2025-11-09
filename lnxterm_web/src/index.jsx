import ReactDOM from 'react-dom/client';
import {unstable_HistoryRouter as HistoryRouter} from 'react-router';
import {Provider} from 'react-redux';
import App from './App.jsx';
import history from  './util/history.js';
import store from './util/store.js';
import './index.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </Provider>
);
