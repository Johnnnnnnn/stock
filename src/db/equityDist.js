Object.defineProperties(module.exports, {
	findOne : {
		value(collection, {date, number}){
			return new Promise((resolve, reject)=>{
				let query = {
					date : date,
					number : number
				}
				collection.findOne(query, function(err, result) {
    				if (err) reject(err);
    				resolve(result);
  				});
			})
		}
	},
	findStock : {
		value(collection, number){
			return new Promise((resolve, reject)=>{
				let query = {
					number : number
				}
				collection.find(query).toArray(function(err, result) {
    				if (err) throw err;
    				console.log(result);
    				resolve()
  				});
			})
		}
	},
	insertOne : {
		value(collection, data){
			return new Promise((resolve, reject)=>{
				collection.insertOne(data, function(err, res) {
	    			if (err) reject(err);
    				console.log(`${data.date} ${data.number} inserted into equityDist!`);
    				resolve()
  				});
			})
		}
	},
	save : {
		value(collection, data){
			return new Promise((resolve, reject)=>{
				this.findOne(collection, data)
					.then((result)=>{
						if(result){
							// this.update()
						}else{
							this.insertOne(collection, data)
						}
						resolve()
					})
			})
		}
	}
})