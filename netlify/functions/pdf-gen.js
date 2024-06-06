const puppeteer = require('puppeteer');

// https://www.blackspike.com/blog/netlify-puppeteer/
// https://github.com/blackspike/netlify-puppeteer-demo

exports.handler = async (event, context) => {
  allowedMethods({ method: event.httpMethod, allowedMethods: ['POST'] });

  const { body } = JSON.parse(event?.body ?? {});
  const html = body?.html;
  const authHeader = event.headers.authorization; // 📌  Authorization header

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.example.com');
  const screenshot = await page.screenshot();

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      screenshot: screenshot.toString('base64'),
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
