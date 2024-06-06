const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.example.com');
  const screenshot = await page.screenshot();

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({ screenshot: screenshot.toString('base64') }),
  };
};
