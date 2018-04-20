const cron = require('cron');
const crawl = require('./server/crawl')
const db = require('./db')
let job;
Object.defineProperties(module.exports , {
	run : {
        value(){
        	crawl.crawlListedCompany()
			   	 		.then((result)=>{
			   	 			for(let i = 0 ; i < result.length ; i++){
			   	 				let company = result[i]
			   	 				let stockNumber = company["\u516c\u53f8\u4ee3\u865f"]
			   	 				if(stockNumber){
			   	 					console.log(`try crawlStock ${stockNumber}`)
			   	 					new Promise((resolve, reject)=>{
			   	 						crawl.crawlStock(stockNumber, new Date())
			   	 					}).then(()=>{
			   	 						console.log(`crawlStock ${stockNumber} success!.`)
			   	 					}).catch((e)=>{
			   	 						console.error(`crawlStock ${stockNumber} error : ${e}` )
			   	 					})
			   	 				}else{
			   	 					console.log("company \u516c\u53f8\u4ee3\u865f not exist!.")
			   	 				}
			   	 			}
			   	 		}).catch((e)=>{
			   	 			console.log('schedule error :' + e)
			   	 		})
			   		
           	job = new cron.CronJob('00 00 4 * * 1-7', function() {
			  	/*
			   	 * Runs every day
			   	 * at 12:00:00 AM.
			   	 */
			   	 	crawl.crawlListedCompany()
			   	 		.then((result)=>{
			   	 			for(let i = 0 ; i < result.length ; i++){
			   	 				let company = result[i]
			   	 				let stockNumber = company["\u516c\u53f8\u4ee3\u865f"]
			   	 				if(stockNumber){
			   	 					new Promise((resolve, reject)=>{
			   	 						crawl.crawlStock(stockNumber, new Date())
			   	 					}).then(()=>{
			   	 						console.log(`crawlStock ${stockNumber} success!.`)
			   	 					}).catch((e)=>{
			   	 						console.error(`crawlStock ${stockNumber} error : ${e}` )
			   	 					})
			   	 				}else{
			   	 					console.log("company \u516c\u53f8\u4ee3\u865f not exist!.")
			   	 				}
			   	 			}
			   	 		})
			   		
			  	}, function () {
			    	/* This function is executed when the job stops */
			    	console.log('job stop!!')
			  	},
			  	true, /* Start the job right now */
			  	"Asia/Taipei"/* Time zone of this job. */
			);    
			job.start()  
        }
    }
})
