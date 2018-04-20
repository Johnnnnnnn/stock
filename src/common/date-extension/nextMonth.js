
Date.prototype.NextMonth = function () { //author: meizz 
	let current
	if (this.getMonth() == 11) {
    	current = new Date(this.getFullYear() + 1, 0, 1);
	} else {
    	current = new Date(this.getFullYear(), this.getMonth() + 1, 1);
	}
	return current
}