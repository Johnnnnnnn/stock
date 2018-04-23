require('./src/common')

let init = true
if(init){
	require('./src/db').dropDb().then(()=>{
		run()
	})
}else{
	run()
}


function run(){
	require('./src/schedule').run()
	require("webpack")(
		require('./webpack.config'),
		(err, stats) => {
  			if (err || stats.hasErrors()) {
    		// Handle errors here
  			}
		}
	)
	require("./src/server/main").run()
}