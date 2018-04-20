/*
	State should be initializedin the constructor when using ES6 classes,
	and define the getInitialState method when using React.createClass.
	[https://stackoverflow.com/questions/30668326/what-is-the-difference-between-using-constructor-vs-getinitialstate-in-react-r]
*/
import $ from 'jquery'
import Stock from '../stock'
import {GoogleCharts} from 'google-charts';

class app extends React.Component {
	constructor(){
		super()
		this.state = {
			stockNumber : 3008
		}
	}
	componentDidMount(){
		// this.$el = $(this.element)
	}
	render() {
		return (
			<div style={{display:'inline-block', width:'1280px'}}>
				<div style={{display:'inline-block', width:'125px', margin:'10px'}}>
					<ul className="list-group">
  						<li className="list-group-item">First item</li>
  						<li className="list-group-item">Second item</li>
  						<li className="list-group-item">Third item</li>
					</ul>
				</div>
				<div style={{display:'inline-block'}}>
					<div className="form-group row" style={{margin:'10px'}}>
  						<div className="col-xs-2">
    						<input className="form-control" type="text" value={this.state.stockNumber} onChange={this.stockNumberChange.bind(this)}/>
  						</div>
  						<div className="col-xs-2" style={{margin:'0 10px'}}>
    						<button className="btn btn-default btn-xs" onClick={this.getData.bind(this)}>submit</button>
						</div>
					</div>
					<div id="chart_div" style={{width:'800px', height:'480px'}}></div>
				</div>
			</div>
		);
	}
	stockNumberChange(event){
		this.setState({stockNumber: event.target.value});
	}
	getData(){//
		$.ajax({
			url: `stock/${this.state.stockNumber}`,
			success(result){
				let stock = new Stock(result)
				GoogleCharts.load(()=>{
					var data = google.visualization.arrayToDataTable((()=>{
						let metaDataArray = []
						for(let h in stock.data){
							let oneMouthData = stock.data[h]
							for(let i = 0 ; i < oneMouthData.length; i++){
								metaDataArray.push([
									oneMouthData[i][0],  // date 
									toNumber(oneMouthData[i][5]),	// lowest
									toNumber(oneMouthData[i][3]),	// start
									toNumber(oneMouthData[i][6]),	// end
									toNumber(oneMouthData[i][4])	// heighest
								])
							}
						}
						return metaDataArray
					})(), true)
					

					var options = {
						chartArea: {
    						// leave room for y-axis labels
      						width: '90%',
      						height: '90%'
    					},
    	      			legend: 'none',
        	  			bar: { groupWidth: '100%' }, // Remove space between bars.
          				candlestick: {
            				fallingColor: { strokeWidth: 0, fill: '#0f9d58'}, // green
            				risingColor: { strokeWidth: 0, fill: '#a52714'}   // red
          				},
	          			tooltip: { isHtml: true },
    	      			hAxis: { textPosition: 'none' }
        			};

	        		var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
    	    		chart.draw(data, options);
        			google.visualization.events.addListener(chart, 'onmouseover', function(e) {
	        			let lowest = data.getValue(e.row, 1)
    	    			let start = data.getValue(e.row, 2)
	    	    		let end = data.getValue(e.row, 3)
    	    			let heighest = data.getValue(e.row, 4)
        				document.getElementsByClassName("google-visualization-tooltip")[0].innerHTML = "" +
        					 data.getValue(e.row, 0) + "<br/>" + 
        					"開盤價：" + start + "<br/>" + 
        					"收盤價：" + end + "<br/>" + 
	        				"最高：" + heighest + "<br/>" + 
		        			"最低：" + lowest + "<br/>"
    				});					
				});
    		}
    	});
	}
}

let reg = /,/g
function toNumber(str){
	return Number(str.replace(reg, ''))
}
export default app;