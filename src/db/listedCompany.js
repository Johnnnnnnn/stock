Object.defineProperties(module.exports, {
	insert : {
		value(collection, data){
			return new Promise((resolve, reject)=>{
				collection.insertMany(data, function(err, res) {
	    			if (err) reject(err);
    				resolve()
  				});
			})
		}
	},
	save : {
		value(collection, data){
			return new Promise((resolve, reject)=>{
				this.insert(collection, data)
			})
		}
	}
})