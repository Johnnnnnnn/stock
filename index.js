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

// const crawl = require('./src/server/crawl')
// crawl.crawlListedCompany()
// crawl.crawlStock(3008, 2017, 8)
// let db = require('./src/db')
// const crawl = require('./src/server/crawl')
// crawl.getEquityDist(3008, '20180413').then((resolve)=>{
// 	db.saveEquityDist(resolve)
// })
