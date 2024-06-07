## [Creating netlify functions](https://www.netlify.com/blog/intro-to-serverless-functions/)

### Project structure:

```
project-root/
├── netlify/  (folder containing your Netlify functions)
│   └── exampleFunction.js
├── node_modules/  (folder containing your Node.js dependencies)
├── package.json
└── netlify.toml

```

### Locally testing functions

```cli

netlify dev
```

To create a new Netlify function using Netlify's Lambda functions in VS Code with Puppeteer, you'll need to follow these steps:

### Set up a new project directory and initialize it:

- Open your terminal in VS Code.
- Create a new directory for your project: `mkdir netlify-function-example`
- Navigate into the newly created directory: `cd netlify-function-example`
- Initialize a new Node.js project: `npm init -y`

### Install Puppeteer:

- Install Puppeteer as a dependency: `npm install puppeteer`

### Create a Netlify function:

- Inside your project directory, create a new directory named netlify-functions: `mkdir netlify-functions`
- Inside the netlify-functions directory, create a new JavaScript file for your function, e.g., exampleFunction.js.

### Write the Netlify function:

In exampleFunction.js, you can write a sample Netlify function that uses Puppeteer. Here is an example of a function that takes a screenshot of a webpage using Puppeteer:

```js
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
```

### Create the netlify.toml file:

- The [build] section specifies the build settings for your Node.js project, including the build command (npm run build) and the directory to publish (dist).
- The [[redirects]] section defines a URL redirect from /old-url to /new-url with a 301 status code.
- The [[headers]] section sets the Cache-Control header for all files to ensure they are not cached.

```toml
[build]
  command = "npm install && npm run build"  # Install dependencies and build the functions
  functions = "netlify/functions"  # Specify the directory where Netlify functions are located
  publish = "public"  # Specify the directory to publish (not needed for function-only projects)

[[redirects]]
  from = "/api/*"  # Redirect API requests to Netlify functions
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
    [headers.values]
    Access-Control-Allow-Origin = "*"  # Add CORS headers for all routes
    Cache-Control = "public, max-age=0, must-revalidate"

[functions]
    node_bundler = "esbuild"

```

### Deploy the function to Netlify:

- Make sure you have your project set up on GitHub and linked to Netlify for automatic deployments.
- Commit your changes to Git and push them to GitHub.
- Netlify will automatically detect the Netlify function in your project and deploy it.

### .env file

`CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`

### Test the function:

- Once deployed, you can test the function by accessing its URL provided by Netlify.

By following these steps, you should be able to create a new Netlify function using Puppeteer in VS Code and have it deployed and running on Netlify.
