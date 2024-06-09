import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '../../lib/helpers';
import axios from 'axios';

// https://www.blackspike.com/blog/netlify-puppeteer/
// https://github.com/blackspike/netlify-puppeteer-demo

const template = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fall Back Template</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="mx-auto h-full">
        <h1 class="text-4xl font-bold text-gray-800">PDF Generator</h1>
        <p class="text-gray-600">Please provide a template.</p>
      </div>
    </body>
  </html>
`;

exports.handler = async (req, context) => {
  try {
    await allowedMethods({ method: req.httpMethod, allowedMethods: ['POST'] });
    await validateAuthorization(req);
    const body = requestBody(req);
    const id = body?.id || Date.now() + Math.random();

    const html = template;

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

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    }); // Set the HTML content of the page
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true }); // Set the PDF format

    // --------------------------------------------------------------------------------
    // 📌  TODO: Buffer compression
    // 📌  Upload the PDF to storage.bunnycdn.com
    // --------------------------------------------------------------------------------
    console.log(
      'Uploading PDF to BunnyCDN...',
      pdfBuffer.length,
      process.env.BUNNYCDN_STORAGE_ZONE_NAME
    );
    // to form data from buffer
    const formData = new FormData();
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('file', blob, 'file.pdf');

    const upload = await axios.put(
      `https://storage.bunnycdn.com/${process.env.BUNNYCDN_STORAGE_ZONE_NAME}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/pdf',
          AccessKey: process.env.BUNNYCDN_STORAGE_ACCESS_KEY,
        },
      }
    );

    console.log('🚀 _upload', upload);

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        base64: pdfBuffer.toString('base64'),
        url: `https://${process.env.BUNNYCDN_STORAGE_ZONE_NAME}.b-cdn.net/${id}`,
      }),
    };
  } catch (error) {
    console.log('🚨 error', error);

    return {
      statusCode: error?.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
