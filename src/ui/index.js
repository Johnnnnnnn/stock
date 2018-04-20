import ReactDOM from 'react-dom';
import App from './app';
import 'bootstrap/dist/css/bootstrap.min.css';
document.body.insertAdjacentHTML( 'beforeend', '<div id="app"></div>');
ReactDOM.render(
	<App/>
    ,
    document.getElementById('app')
)