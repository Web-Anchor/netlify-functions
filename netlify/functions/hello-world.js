export const handler = async () => {
  const response = new Response();

  response.headers.set('Access-Control-Allow-Origin', '*'); // allow all origins

  return response.status(200).json({
    message: 'Hello World!',
  });
};
