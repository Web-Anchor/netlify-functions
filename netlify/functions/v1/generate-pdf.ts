import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '@lib/helpers';
import axios from 'axios';
import { noFoundTemplate } from '@lib/templates';

// https://www.blackspike.com/blog/netlify-puppeteer/
// https://github.com/blackspike/netlify-puppeteer-demo

exports.handler = async (req: { httpMethod: any }, context: any) => {
  try {
    await allowedMethods({ method: req.httpMethod, allowedMethods: ['POST'] });
    await validateAuthorization(req);
    const body = requestBody(req);
    const id = body?.id || Date.now() + Math.random();
    const fileType = body?.fileType || 'pdf';

    const html = body?.html || noFoundTemplate;

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

    // --------------------------------------------------------------------------------
    // 📌 Set the HTML content of the page
    // page.goto with a data: URL, Puppeteer will trigger network requests to load external resources like images, scripts, and stylesheets
    // --------------------------------------------------------------------------------
    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true }); // Set the PDF format

    // --------------------------------------------------------------------------------
    // 📌  TODO: Buffer compression
    // 📌  Upload the PDF to storage.bunnycdn.com
    // --------------------------------------------------------------------------------
    const formData = new FormData();
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('file', blob, 'file.pdf');

    await axios.put(
      `https://storage.bunnycdn.com/${process.env.BUNNYCDN_STORAGE_ZONE_NAME}/${id}.${fileType}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/pdf',
          AccessKey: process.env.BUNNYCDN_STORAGE_ACCESS_KEY,
        },
      }
    );
    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        bufferLength: pdfBuffer.length,
        url: `https://${process.env.BUNNYCDN_STORAGE_CDN_NAME}.b-cdn.net/${id}.${fileType}`,
      }),
    };
  } catch (error: any) {
    console.log('🚨 error', error);
    return {
      statusCode: error?.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
