//http://www.twse.com.tw/exchangeReport/STOCK_DAY?date=20180328&stockNo=9958
const http = require('http');
const https = require('https');
const iconv = require('iconv-lite');
const {JSDOM} = require('jsdom')
const $ = require('jquery')
const db = require('../db')

const crawl = {}
Object.defineProperties(crawl, {
    crawl : {
        value(){
            let promise = Promise.resolve();
            this.crawlListedCompany()
                .then((result)=>{
                    let delayTime = 3000
                    let date = new Date()
                    for(let i = 0 ; i < result.length ; i++){
                        let company = result[i]
                        let stockNumber = company["\u516c\u53f8\u4ee3\u865f"]
                        if(stockNumber){
                            promise = promise.then(()=>{
                                return this.crawlStock(stockNumber, date)
                            }).then(()=>{
                                return new Promise((resolve)=>{
                                    setTimeout(()=>{
                                        resolve()
                                    }, delayTime)
                                })
                            })
                        }else{
                            console.log("company \u516c\u53f8\u4ee3\u865f not exist!.")
                        }
                    }
                });
            return promise
        }
    },
    crawlEquityDist : {
        value(stockNumber, date, crawledTimes){
            if(!crawledTimes){
                crawledTimes = 0
            }
            let geEquityProcess = crawl.getEquityDist(stockNumber, date)
            geEquityProcess.then((result)=>{
                db.saveEquityDist(result)
                 let tomorrow = date.Tomorrow()
                    if(!tomorrow.IsFuture()){
                         setTimeout(()=>{
                            this.crawlEquityDist(stockNumber, date.Tomorrow(), 0)
                        }, 2000)
                    }
            }).catch((reject)=>{
                if(crawledTimes == 0){
                    this.crawlEquityDist(stockNumber, date, 1)
                }else{
                    let tomorrow = date.Tomorrow()
                    if(!tomorrow.IsFuture()){
                        this.crawlEquityDist(stockNumber, date.Tomorrow(), 0)
                    }
                }
            })
        }
    },
    crawlListedCompany : {
        value(){
            return new Promise((resolve, reject)=>{
                // https://quality.data.gov.tw/dq_download_json.php?nid=18419&md5_url=4932a781923479c4c782e8a07078d9e9
                https.get(
                    `https://quality.data.gov.tw/dq_download_json.php?nid=18419&md5_url=4932a781923479c4c782e8a07078d9e9`,
                    (res)=>{
                        const { statusCode } = res;
                        const contentType = res.headers['content-type'];

                        let error;
                        if (statusCode !== 200) {
                            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                        } else if (!/^application\/json/.test(contentType)) {
                            error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
                        }
                        if (error) {
                            reject(error.message);
                            // consume response data to free up memory
                            res.resume();
                            return;
                        }

                        res.setEncoding('utf8');
                        let rawData = '';
                        res.on('data', (chunk) => { rawData += chunk; });
                        res.on('end', () => {
                            try {
                                const parsedData = JSON.parse(rawData);
                                resolve(parsedData); 
                            } catch (e) {
                                reject(e.message);
                            }
                        });
                    }
                ).on('error', (e) => {
                    reject(`Got error: ${e.message}`);
                });
            })
        }
    },
    crawlPrice : {
        value(stockNumber, date){
            let getPriceProcess = crawl.getPrice(stockNumber, date)
            getPriceProcess.then((result)=>{
                db.savePrice(result)
            }).catch((reject)=>{
                console.log(`craw Price reject : ${reject}`)
            })
        }
    },
	crawlStock : {
        value(stockNumber, date){
            return [new Promise(()=> {
                this.crawlPrice(stockNumber, date)
            })]
            // new Promise(()=> {this.crawlEquityDist(stockNumber, date)})
        }
    },
    getEquityDist : {
        value(stockNumber, date){
            let getEquityDist
            return new Promise((resolve, reject)=>{
                let postData = `scaDate=${date}&SqlMethod=StockNo&StockNo=${stockNumber}&REQ_OPR=SELECT&clkStockNo=${stockNumber}`
                let options = {
                    host: 'www.tdcc.com.tw',
                    port: 443,
                    path: '/smWeb/QryStockAjax.do?',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
                    }
                };

                var req = https.request(options, function(res) {
                    let bufArray = [];
                    res.on('data', function (chunk) {
                        bufArray.push(chunk);
                    });
                    res.on('end', function () {
                        let resContent = Buffer.concat(bufArray)
                        let resHtml = iconv.decode(resContent, 'BIG5')
                        let { window } = new JSDOM(resHtml);
                        let $ = require('jquery')(window);
                        let dataTable = $('table')[8]
                        let data = []
                        $(dataTable).find('tr').each((index, tr)=>{
                            let tmp = []
                            $(tr).find('td').each((index, td)=>{
                                tmp.push($(td).html())
                            })
                            data.push(tmp)
                        })
                        resolve({
                            number : stockNumber.toString(), 
                            date : date,
                            data : data
                        })
                    });
                });

                req.on('error', function(e) {
                    reject('problem with request: ' + e.message);
                });
    
                // write data to request body
                req.write(postData);
                req.end();
            })
        }
    },
    getPrice : {
        value(stockNumber, date){
            return new Promise((resolve, reject)=>{
                http.get(
                    `http://www.twse.com.tw/exchangeReport/STOCK_DAY?date=${date.Format('yyyyMM01')}&stockNo=${stockNumber}`,
                    (res)=>{
                        const { statusCode } = res;
                        const contentType = res.headers['content-type'];

                        let error;
                        if (statusCode !== 200) {
                            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                        } else if (!/^application\/json/.test(contentType)) {
                            error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
                        }
                        if (error) {
                            reject(error.message);
                            // consume response data to free up memory
                            res.resume();
                            return;
                        }

                        res.setEncoding('utf8');
                        let rawData = '';
                        res.on('data', (chunk) => { rawData += chunk; });
                        res.on('end', () => {
                            try {
                                const parsedData = JSON.parse(rawData);
                                if(parsedData.stat == "OK"){
                                    parsedData.number = stockNumber.toString()
                                    resolve(parsedData); 
                                }else{
                                    reject('data not found!');
                                }
                            } catch (e) {
                                reject(e.message);
                            }
                        });
                    }
                ).on('error', (e) => {
                    reject(`Getting Price of ${stockNumber}/${date} by http got error: ${e.message}`);
                });
            })
        }
    }
})
module.exports = crawl
