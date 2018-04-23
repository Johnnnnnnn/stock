Date.prototype.IsFuture = function () { //author: meizz 
	return this.getTime() > Date.now();
}