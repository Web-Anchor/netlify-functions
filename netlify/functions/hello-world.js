export const handler = async (request, context) => {
  return new Response(
    {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello World',
      }),
    },
    {
      headers: {
        'access-control-allow-origin': '*',
      },
    }
  );
};
