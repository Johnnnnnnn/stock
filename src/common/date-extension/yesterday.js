Date.prototype.Yesterday = function () { //author: meizz 
	return new Date(this.getTime() - 86400000);
}