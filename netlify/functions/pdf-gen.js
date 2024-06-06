import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// https://www.blackspike.com/blog/netlify-puppeteer/
// https://github.com/blackspike/netlify-puppeteer-demo

exports.handler = async (event, context) => {
  allowedMethods({ method: event.httpMethod, allowedMethods: ['POST'] });

  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>PDF</title>
      </head>
      <body>
        <h1>PDF</h1>
        <p>PDF content</p>
      </body>
    </html>
  `;

  const { body } = JSON.parse(event?.body ?? {});
  const html = body?.html || template;

  const authHeader = event.headers.authorization; // 📌  Authorization header

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        '/var/task/node_modules/@sparticuz/chromium/bin'
      )),
  });
  const page = await browser.newPage();

  // get google.com screenshot
  await page.goto('https://google.com');
  const screenshot = await page.screenshot();

  // get pdf buffer from html
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      screenshot: screenshot.toString('base64'),
      pdf: pdfBuffer.toString('base64'),
      authHeader,
      html,
    }),
  };
};

function allowedMethods({ method, allowedMethods = [] }) {
  // --------------------------------------------------------------------------------
  // 📌  allowedMethods types string[]
  // --------------------------------------------------------------------------------
  if (!allowedMethods.includes(method)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
}

function validateAuthorization({ authHeader }) {
  // --------------------------------------------------------------------------------
  // 📌  authHeader types string
  // --------------------------------------------------------------------------------
  if (authHeader !== 'Bearer secret') {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }
}
