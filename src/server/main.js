const express = require('express');
const crawl = require('./crawl')
const db = require('../db')
const app = express();
/*
	This file was required by index.js in root. 
	It seems the base path is root, so there is no need relative path of 'dist'
*/
app.use(express.static('dist'));

app.get('/stock/:stockNumber', function(req, res) {
	db.getStock(req.params.stockNumber).then((result)=>{
		res.send(result)
	}).catch((reject)=>{
		res.send(reject)
	})
	// crawl.getData(req.params.stockNumber, 2018, 2).then((result) => {res.send(result);})
});


module.exports = {
	run(){
		app.listen(18591, () => console.log('Example app listening on port 18591!'))
	}
}