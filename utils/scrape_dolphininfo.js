const fs = require('fs/promises');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {queryPromise} = require('./mysql');

function getURL() {
  const urls = [];
  for (k=1; k<2; k++) {
    if (k<10) {
      urls.push(`https://www.oca.gov.tw/ch/home.jsp?id=289&parentpath=0,5&mcustomize=ocamaritime_view.jsp&dataserno=20210310000${k}`);
    } else {
      urls.push(`https://www.oca.gov.tw/ch/home.jsp?id=289&parentpath=0,5&mcustomize=ocamaritime_view.jsp&dataserno=2021031000${k}`);
    }
  }
  for (j=5; j<12; j++) {
    if (j<10) {
      urls.push(`https://www.oca.gov.tw/ch/home.jsp?id=289&parentpath=0,5&mcustomize=ocamaritime_view.jsp&dataserno=20210312000${j}`);
    } else {
      urls.push(`https://www.oca.gov.tw/ch/home.jsp?id=289&parentpath=0,5&mcustomize=ocamaritime_view.jsp&dataserno=2021031200${j}`);
    }
  }
  for (i = 1; i<21; i++) {
    if (i<10) {
      urls.push(`https://www.oca.gov.tw/ch/home.jsp?id=289&parentpath=0,5&mcustomize=ocamaritime_view.jsp&dataserno=20210316000${i}`);
    } else {
      urls.push(`https://www.oca.gov.tw/ch/home.jsp?id=289&parentpath=0,5&mcustomize=ocamaritime_view.jsp&dataserno=2021031600${i}`);
    }
  }

  return urls;
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function crawler() {
  try {
    // URL of target pages
    const urls = getURL();
    let data = {};
    // Use for loop to aviod foreach synchronous behaviour
    for (i = 0; i< urls.length; i++) {
      const html = await fetch(urls[i]).then((res) => res.text());
      // Cheerio to manipulate DOM objects
      const $ = cheerio.load(html);
      $('.news').each((i, el) => {
        try {
          const title = $(el)
              .find('.subject')
              .text();

          const img =
                    $(el)
                        .find('img')
                        .attr('src');

          const txt = $(el)
              .find('.tt')
              .text()
              .split('\n');

          const name = txt[0];
          const alias = txt[1];
          const nameEng = txt[2];
          const nameScientific = txt[3];

          // return array according to requiremnts
          txt.splice(0, 5);
          const text = txt.join('\n');
          data = {
            title: title,
            img: 'https://www.oca.gov.tw/'+img,
            name: name,
            alias: alias,
            nameEng: nameEng,
            nameScientific: nameScientific,
            text: text,
          };
          timeout(2000);
        } catch (err) {
          console.log('error during crawling process', err.message);
        }
      });
      // Insert to table dolphin_info
      const createDolphinInfo = [data.title, data.img, data.name, data.alias, data.nameEng, data.nameScientific, data.text];
      const sqlCreateDolphinInfo = 'INSERT INTO dolphin_info (title, img, name, alias, name_eng, name_scientific, text) VALUES (?)';
      await queryPromise(sqlCreateDolphinInfo, [createDolphinInfo]);
    }
  } catch (err) {
    console.log(err.message);
  }
})();
