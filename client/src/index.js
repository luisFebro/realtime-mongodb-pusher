import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppOld from './AppOld';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppOld />, document.getElementById('root'));
registerServiceWorker();
