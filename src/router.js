import ReactDOM from 'react-dom';

// import Coordinate from './react-chart/coordinate';
import KChart from './stockGraphicJs/K-chart';
import Data from './mock/data';

ReactDOM.render(
	<div style={{margin:'50'}}>
		<KChart 
			data={Data}
			xNum={60}
		/>
    </div>
    ,
    document.getElementById('app')
)