import puppeteer from "puppeteer";

export default async function scrapePage(url, browser = undefined) {
  try {
    if(!browser){
      browser = await puppeteer.launch({
        args: ['--disable-http2']
      });
    }
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;'
    })
    await page.goto(url, {waitUntil: 'networkidle2'});
    const html = await page.content();
    const textContent = await page.evaluate(() => document.body.innerText);
    const hyperlinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'), a => {
        return {link: a.href, text: a.innerText}
      })
    })
    await browser.close();

    return {
      html: html,
      text: textContent,
      links: hyperlinks
    }
  } catch (error) {
    console.error(error);
  }
}