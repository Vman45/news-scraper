// reddit-scraper.js

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

    // Viewport && Window size
    const width = 1800
    const height = 1000


const url = 'https://www.startse.com/noticias/empreendedores';
var pageKeep;
puppeteer
  .launch({headless:false, defaultViewport: null, args:[`--window-size=${ width },${ height }`, '--no-sandbox', '--disable-setuid-sandbox']})
  .then(browser => browser.newPage())
  .then(page => {
    return page.goto(url).then(function() {
      pageKeep = page;
      return page.content();
    });
  })
  .then(html => {
    const $ = cheerio.load(html);
    const newsHeadlines = [];
    $('#latest-articles .row.mt-30').each(function() {
        const title = $(this).find('.latest-articles-title').text();
        const description = $(this).find('.latest-articles-description').text();
        const link = $(this).find('picture').parent().attr('href');
        const image = $(this).find('picture img').attr('src');
    
      if(link){
        newsHeadlines.push({
          title,
          description,
          link: 'https://startse.com'+link,
          image
        })
      

      }
     
      
        
       //await page.waitForNavigation({ waitUntil: 'networkidle2' });

    });

    
    fs.writeFile('./startse.json', JSON.stringify(newsHeadlines), err => err ? console.log(err): null);
    
   // console.log(newsHeadlines);
  })
  .catch(console.error);