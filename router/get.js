import express from 'express';
const router=express.Router();
import  puppeteer from 'puppeteer';
import functions from 'firebase-functions';
let movies='';



router.get('/home',async (req, res)=>{

  //console.log(movies)
  if(movies==''){
      console.log("LAUNCHING")
      const browser = await puppeteer.launch({
        headless: true,
        timeout: 0,
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--window-size=1280,720',
        ],
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      console.log("ACCESSING SITE")
      await page.goto('https://o2tvseries.com/search/list_all_tv_series');
      console.log("started")
      movies = await page.evaluate(() => Array.from(document.querySelectorAll('.data a'), element =>{
        return(
          {name: element.innerText,link:element.getAttribute('href')}
        )
      }));
      console.log("movies")
      await browser.close();
      res.json({"express":movies})
  }
  else{
    res.json({"express":movies})
  }
   
})

export  {router};