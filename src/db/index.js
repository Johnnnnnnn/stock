var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const listedCompanyCollection = require('./listedCompany')
const equityDistCollection = require('./equityDist')
const priceCollection = require('./price')

function connect(collectionName){
	return new Promise((resolve, reject)=>{
		MongoClient.connect(url, function(err, db) {
			if (err) reject(err);
			let dbo = db.db("stocks");
			resolve({
				collection : collectionName? dbo.collection(collectionName) : null,
				db : db,
				dbo : dbo
			});
		})
	})
}
Object.defineProperties(module.exports, {
	dropDb : {
		value(){
			return new Promise((resolve, reject)=>{
				connect()
				.then(({collection, dbo, db})=>{
					dbo.dropDatabase(function(err, result){
						console.log("Error : "+err);
						if (err) throw err;
						console.log("Operation Success ? "+result);
						// after all the operations with db, close it.
						db.close();
						resolve();
					});
				})
			})
		}
	},
	getStock : {
		value(number, collectionName){
			if(!collectionName){
				//getAll
				return new Promise((resolve, reject)=>{
					let priceData, equityDistData;
					connect()
					.then((result)=>{
						db = result.db;
						dbo = result.dbo;
						return Promise.all([
							priceCollection.findStock(
								dbo.collection('price'), 
								number
							), 
							equityDistCollection.findStock(
								dbo.collection('equityDist'), 
								number
							)
						])
					}).then((results)=>{
						[priceData, equityDistData] = results
					}).catch((reject)=>{
						console.error(`Get ${number} from db fail : ${reject}`)
					}).finally(()=>{
						db.close()
						resolve({
							equityDist : equityDistData,
							price : priceData
						})
					})
				})
			}else{
				return new Promise((resolve, reject)=>{
					resolve('this api is not completed')
				})
			}
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
				equityDistCollection.save(collection, data).finally(()=>{
					db.close()
				})
			})
		}
	},
	saveListedCompany : {
		value(data){
			connect('listedCompany')
			.then(({collection, db})=>{
				listedCompanyCollection.save(collection, data).finally(()=>{
					db.close()
				})
			})
		}
	},
	savePrice : {
		value(data){
			connect('price')
			.then(({collection, db})=>{
				priceCollection.save(collection, data).finally(()=>{
					db.close()
				})
			})
		}
	}
})
