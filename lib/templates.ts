export const noFoundTemplate = `
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
        <p class="text-gray-600">Please provide a template to generate a PDF.</p>
      </div>

      <footer class="fixed bottom-0 w-full bg-gray-100 p-4">
        <p class="text-center text-gray-600">© ${new Date().getFullYear()} PDF Generator</p>
      </footer>
    </body>
  </html>
`;
