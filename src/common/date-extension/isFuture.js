Date.prototype.IsFuture = function () { //author: meizz 
	console.log(new Date(this.getTime()))
	console.log(Date.now())
	return this.getTime() > Date.now();
}