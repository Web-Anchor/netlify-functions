import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '../../lib/helpers';

// https://www.blackspike.com/blog/netlify-puppeteer/
// https://github.com/blackspike/netlify-puppeteer-demo

const fallBackTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fall Back Template</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container mx-auto h-full bg-green-100">
        <h1 class="text-2xl font-bold">Template not Provided!</h1>
      </div>
    </body>
  </html>
`;

exports.handler = async (req, context) => {
  try {
    await allowedMethods({ method: req.httpMethod, allowedMethods: ['POST'] });
    // await validateAuthorization(req);
    const body = requestBody(req);

    const html = body?.html || fallBackTemplate;

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

    await page.setContent(html); // Set the HTML content of the page
    const pdfBuffer = await page.pdf({ format: 'A4' }); // Set the PDF format

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        pdf: pdfBuffer.toString('base64'), // Data Transfer: Base64 Data Transfer
        html,
      }),
    };
  } catch (error) {
    return {
      statusCode: error?.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
