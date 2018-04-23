Object.defineProperties(module.exports, {
	findOne : {
		value(collection, {date, number}){
			return new Promise((resolve, reject)=>{
				let query = {
					date : date,
					number : number
				}
				collection.findOne(query, {'_id': 0}, function(err, result) {
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
				collection.find(query, {'_id': 0}).toArray(function(err, result) {
    				if (err) throw err;
    				resolve(result)
  				});
			})
		}
	},
	insertOne : {
		value(collection, data){
			return new Promise((resolve, reject)=>{
				collection.insertOne(data, function(err, res) {
	    			if (err) reject(err);
    				console.log(`${data.number} ${data.date} inserted into price!`);
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
							if(result.data.length > data.data.length){
								this.update()	
							}
						}else{
							this.insertOne(collection, data)
						}
						resolve()
					})
			})
		}
	},
	update : {
		value(collection, data){
			return new Promise((resolve, reject)=>{
				let newValue = {
					$set : {
						data : data.data
					}
				}
				let query = {
					date : data.date,
					number : data.number
				}
				collection.updateOne(query, newValue, function(err, result) {
    				if (err) reject(err);
    				console.log(`${data.number} ${data.date} update price!`)
    				resolve();
  				});
			})
		}
	},
})