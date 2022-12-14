import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Apps from './Apps';
import "jquery/dist/jquery.js"
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/css/bootstrap.min.css"
import * as serviceWorker from './serviceWorker';
import { BrowserRouter} from 'react-router-dom'

ReactDOM.render(<BrowserRouter><Apps /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
