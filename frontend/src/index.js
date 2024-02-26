import React from 'react';
import ReactDOM from 'react-dom/client';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'dayjs/locale/pt-br.js';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  registerLicense,
  loadCldr,
  setCulture,
  L10n,
} from '@syncfusion/ej2-base';

loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/pt/ca-gregorian.json'),
  require('cldr-data/main/pt/numbers.json'),
  require('cldr-data/main/pt/timeZoneNames.json')
);

L10n.load({
  pt: {
    schedule: {
      day: 'Dia',
      week: 'Semana',
      workWeek: 'Dias Úteis',
      month: 'Mês',
      agenda: 'Próximos Agendamentos',
      today: 'Hoje',
      noEvents: 'Sem agendamentos',
    },
    calendar: { today: 'Hoje' },
  },
});

setCulture('pt');

registerLicense(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
