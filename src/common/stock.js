module.exports = function(rawData){
	let titleSplit
	let dataObject = {}
	if(Array.isArray(rawData)){
		for(let i = 0 ; i < rawData.length ; i++){
			titleSplit = rawData[i].title.split(' ')
			dataObject[titleSplit[0]] = rawData[i].data
		}
	}else{
		titleSplit = rawData.title.split(' ')
		dataObject[titleSplit[0]] = rawData.data
	}
	
	Object.defineProperties(this, {
		'data' : {
			get(){
				return dataObject
			}
		},
		'name' : {
			get(){
				return titleSplit[2]
			}
		},
		'number' : {
			get(){
				return titleSplit[1]
			}
		}
	})
}