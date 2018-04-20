const cron = require('cron');
const crawl = require('./server/crawl')
const db = require('./db')
let job;
Object.defineProperties(module.exports , {
	run : {
        value(){
			crawl.crawl()		
           	job = new cron.CronJob('00 00 4 * * 1-5', function() {
			  	/*
			   	 * Runs every day
			   	 * at 4:00:00 AM.
			   	 */
			   	 	crawl.crawl()
			  	}, function () {
			    	/* This function is executed when the job stops */
			    	console.log('schedule job end.')
			  	},
			  	true, /* Start the job right now */
			  	"Asia/Taipei"/* Time zone of this job. */
			);
        }
    }
})
