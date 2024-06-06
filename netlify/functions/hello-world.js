export const handler = async (request, context) => {
  const body = JSON.parse(request.body);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTION',
    },
    body: JSON.stringify({
      message: 'Hello World!',
      body,
    }),
  };
};
