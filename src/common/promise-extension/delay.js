Promise.prototype.Delay = function (milliseconds) { //author: meizz 
	return this.then((results)=>{
		return new Promise((resolve)=>{
        	setTimeout(()=>{
        		resolve(results)
			}, milliseconds)
		})
	})
}