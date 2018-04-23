require('./src/common')

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

