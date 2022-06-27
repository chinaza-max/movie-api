import express from 'express';
import puppeteer from 'puppeteer';
const router = express.Router();
import fs from 'fs';
import PQueue from 'p-queue';

const queue = new PQueue({concurrency: 1});
//process.setMaxListeners(0)

import emitter from 'events'
emitter.setMaxListeners(0)
//.EventEmitter.defaultMaxListeners = 15;


const firefoxOptions = {
  product: 'firefox',
  extraPrefsFirefox: {
    // Enable additional Firefox logging from its protocol implementation
    // 'remote.log.level': 'Trace',
  },
  // Make browser logs visible
  dumpio: true,
};

import { createWorker, createScheduler }from 'tesseract.js'
const scheduler = createScheduler();

function createNewtrainedData(path1,path2){
  fs.copyFile(path1,path2, (err) => {
   // if (err) throw err;
    //console.log('File Copy Successfully.');
  })
}

function newTrainData(path1,path2,callBackF){
  fs.unlink(path2,()=>callBackF(path1,path2))
}

router.post('/api', async (req, res,) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  try{
   
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    console.log("ACCESSING SITE2")
    await page.goto(req.body.data);
    console.log("started2")
    const movies = await page.evaluate(() => Array.from(document.querySelectorAll('.data a'), element => {
      return (
        { name: element.innerText, link: element.getAttribute('href') }
      )
    }));
  
    console.log("movies")
    await browser.close();
    res.json({ "express": movies })
  }
  catch (error) {
    console.log(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

})



let noOfmOVIEDownloaded=0
router.post('/downloadAPI', async (req, res,) => {
  

  let url = req.body.data;
  let result=[];
  async function queueScraper(url) {

    await new Promise((resolve) => {
    queue.add(async() =>{

      class downloadURL{
        constructor(url){
          this.url=url
          this.length=url.length;
        }

        async  startDownload(){
              let episodeList=[]

          for (let i = 0; i < this.length; i++) {
    
            const browser = await puppeteer.launch({
              headless: true,
              args: ['--no-sandbox','--disable-setuid-sandbox']
            });
            try{
              const page = await browser.newPage();
              page.setDefaultNavigationTimeout(0);
              await page.goto(this.url[i]);
          
              //await page.evaluate(() => Array.from(document.querySelectorAll('.data a'), element =>element[1].click()));
              await page.evaluate(() => document.querySelectorAll('.data a')[1].click());
              await page.waitForNavigation()
              page.setDefaultNavigationTimeout(0); 
  
        async function passRecaptcha(newPage,worker) {
                const filePath =`./tesseract/langs/eng.traineddata`;
                const filePathCopy = `eng.traineddata`;
                const filePathCopy2 = `./router/eng.traineddata`;
          
                if(i==0){
                //  newTrainData(filePath,filePathCopy,createNewtrainedData)
                //  newTrainData(filePath,filePathCopy2,createNewtrainedData)
                }
                await newPage.setDefaultNavigationTimeout(0); 
                await newPage.waitForSelector('body > center > form > img', { timeout: 0 })
                const element = await newPage.$('body > center > form > img');
                const elementScreenshot = await element.screenshot()
                  await worker.load();
                  await worker.loadLanguage('eng');
                  await worker.initialize('eng');
                  scheduler.addWorker(worker);
                  const results = await scheduler.addJob('recognize',elementScreenshot)
                  const text=results.data.text
                await newPage.waitForSelector('body > center > form > input[type=text]:nth-child(8)', { timeout: 0 })
                
                //----------------------for clearing input field -----------------------------------------
                await newPage.evaluate(() => {
                  const element = document.querySelector('body > center > form > input[type=text]:nth-child(8)')
                  if (element) {
                    
                    return element.value=''
                  }
                 
                  return 'do not exit';
                })
                //----------------------for clearing input field -----------------------------------------
                await newPage.type('body > center > form > input[type=text]:nth-child(8)', text, { delay: 200 });
          
              
                const elementTextContent = await newPage.evaluate(() => {
                  const element = document.querySelector('body > video > source')
                  if (element) {
                    return element.src
                  }
                
                  return 'do not exit';
                })
                if('do not exit'==elementTextContent){
                  await newPage.goBack();
                  const worker2 = createWorker();
                return  passRecaptcha(newPage,worker2)

                }   
                else{  
                  await browser.close();
                  episodeList.push(elementTextContent)
                  //console.log(elementTextContent)
                  if(episodeList.length==url.length){
                    console.log("NO of movie downloaded:=========="+ ++noOfmOVIEDownloaded +"============")
                    result=episodeList
                    return resolve(episodeList);
                     
                  }
                }
                     
              }
              const worker = createWorker();
            passRecaptcha(page, worker)
            }catch (error) {
              console.log(error);
            } 
            finally {
              if (browser) {

                await browser.close();
              }
            }
          }
        }
      }
      let users=new downloadURL(url);
    users.startDownload()
    });
  });
  console.log(result)
  res.status(200).json({express:result});
  }
  queueScraper(url);
   
})

export  {router};


/**                throw new Error('Execution context was destroyed, most likely because of a navigation.');
[server]                       ^
[server]
[server] Error: Execution context was destroyed, most likely because of a navigation.  */