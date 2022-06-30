import express from 'express';
const router=express.Router();
import  puppeteer from 'puppeteer';
let movies='';



router.get('/home',async (req, res)=>{

  //console.log(movies)
  if(movies==''){
      console.log("LAUNCHING")
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
      });

      
      const page = await browser.newPage();

      await page.setRequestInterception(true);

      //if the page makes a  request to a resource type of image or stylesheet then abort that            request
      page.on('request', request => {
          if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet'|| req.resourceType() == 'font' )
              request.abort();
          else
              request.continue();
      });

     page.setDefaultNavigationTimeout(0);
      console.log("ACCESSING SITE")
      await page.goto('https://o2tvseries.com/search/list_all_tv_series')
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