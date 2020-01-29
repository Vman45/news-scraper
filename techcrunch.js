// reddit-scraper.js

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    
    // Viewport && Window size
    const width = 1800
    const height = 1000


  const browser = await puppeteer.launch({headless:false, defaultViewport: null, args:[`--window-size=${ width },${ height }`, '--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({ width, height })

  await page.goto('https://techcrunch.com/startups/');

  const html = await page.content();


  const $ = cheerio.load(html);

  const newsTable = $('.river--category article');
  
  const content = [];

  newsTable.each(async function () {
    const title = $(this).find('.post-block__title').text();
    const description = $(this).find('.post-block__content').text();
    const link = $(this).find('.post-block__title__link').attr('href');

    content.push({
      title,
      description,
      link
    });

    // await page.goto(`https://techcrunch.com${link}`);
    // await page.waitForNavigation({ waitUntil: 'networkidle' });

    // await Promise.all([
    //     page.waitForNavigation(), // wait for navigation to happen
    //     link.click(), // click link to cause navigation
    //   ]);
    

  });
    fs.writeFile('./techcrunch.json', JSON.stringify(content), err => err ? console.log(err): null);



//   // example: get innerHTML of an element
//   const someContent = await page.$eval('.lista-content', el => el.innerHTML);

  // Use Promise.all to wait for two actions (navigation and click)
  


//   // another example, this time using the evaluate function to return innerText of body
//   const moreContent = await page.evaluate(() => document.body.innerText);
//   console.log(moreContent)
  // click another button
 // await page.click('#button');

  // close brower when we are done
  //await browser.close();
})();