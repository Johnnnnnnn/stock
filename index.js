require('./src/common')

let init = false
if(init){
	require('./src/db').dropDb().then(()=>{
		run()
	})
}else{
	run()
}


function run(){
	// require('./src/schedule').run()
	// require("webpack")(
	// 	require('./webpack.config'),
	// 	(err, stats) => {
 //  			if (err || stats.hasErrors()) {
 //    		// Handle errors here
 //  			}
	// 	}
	// )
	// require("./src/server/main").run()
		require('./src/server/crawl').crawlHistory(9958, new Date(2017, 9, 1))

}

// let testArray = [1,2,3,4,5]
// let i = 0
// let promise = Promise.resolve()
// while(i < testArray.length){
// 	promise = promise.then((result)=>{
// 		console.log(testArray[i])
// 	}).Delay(2500)
// 	i++
// }