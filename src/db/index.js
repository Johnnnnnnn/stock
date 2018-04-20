var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const listedCompany = require('./listedCompany')
const equityDist = require('./equityDist')
const price = require('./price')

function connect(collectionName){
	return new Promise((resolve, reject)=>{
		MongoClient.connect(url, function(err, db) {
			if (err) reject(err);
			let dbo = db.db("stocks");
			resolve({
				collection : dbo.collection(collectionName),
				db : db
			});
		})
	})
}
Object.defineProperties(module.exports, {
	getStock : {
		value(number){
			return new Promise((resolve, reject)=>{
				// connect().then((result)=>{
				// 	let {collection, db} = result
				// 	let queryCondition = {
				// 		title : new RegExp(number)
				// 	}
				// 	collection.find(
				// 		queryCondition
				// 	).toArray((err, resArray)=>{
				// 		if (err) throw err;
				// 		db.close();
				// 		if(resArray.length != 0){
				// 			resolve(resArray)
				// 		}else if(resArray.length == 0){
				// 			reject(`there is no data of ${number} in database`);
				// 		}
				// 	})
				// })

				// MongoClient.connect(url, function(err, db) {
				// 	if (err) throw err;
				// 	var dbo = db.db("stocks");
				// 	let collection = dbo.collection("stocks");
				// 	let queryCondition = { title: '107年03月 9958 世紀鋼           各日成交資訊'}
				// 	// let queryCondition = {
				// 	// 	title : dataSheet.title
				// 	// }
				// 	collection.find(
				// 		{},
				// 		queryCondition
				// 	).toArray((err, resArray)=>{
				// 		if (err) throw err;
				// 		if(resArray.length == 1){
				// 			resolve(resArray)
				// 		}else if(resArray.length == 0){
				// 			reject(`there is no data of ${number} in database`);
				// 		}else{
				// 			reject('The resArray must be 1 or 0!! Its wired.')
				// 		}
				// 		db.close();
				// 	})
				// });
			})
		}
	},
	save : {
		value(dataSheet, callback){
			// MongoClient.connect(url, function(err, db) {
			// 	if (err) throw err;
			// 	var dbo = db.db("stocks");
			// 	let collection = dbo.collection("stocks");
			// 	console.log(dataSheet.title)
			// 	let queryCondition = {
			// 		title : dataSheet.title
			// 	}
			// 	collection.find(
			// 		queryCondition
			// 	).toArray((err, resArray)=>{
			// 		if (err) throw err;
					
			// 		if(resArray.length == 1){
			// 			console.log('found : ' + resArray[0].title)
			// 			let newValue = {$set: {data:dataSheet.data}}
			// 			collection.updateOne(queryCondition, newValue, (err, res)=>{
			// 				if (err) throw err;
			// 				console.log('updateOne!')
			// 			})
			// 		}else if(resArray.length == 0){
			// 			collection.insertOne(dataSheet, function(err, res) {
   //  						if (err) throw err;
   // 							console.log("1 document inserted");
  	// 					});
			// 		}else{
			// 			console.log('The resArray must be 1 or 0!! Its wired.')
			// 		}
			// 		db.close();
			// 	})
			// })
		}
	},
	saveEquityDist : {
		value(data){
			connect('equityDist')
			.then(({collection, db})=>{
				equityDist.save(collection, data).finally(()=>{
					db.close()
				})
			})
		}
	},
	saveListedCompany : {
		value(data){
			connect('listedCompany')
			.then(({collection, db})=>{
				listedCompany.save(collection, data).finally(()=>{
					db.close()
				})
			})
		}
	},
	savePrice : {
		value(data){
			connect('price')
			.then(({collection, db})=>{
				price.save(collection, data).finally(()=>{
					db.close()
				})
			})
		}
	}
})
