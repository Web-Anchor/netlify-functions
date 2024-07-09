import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '../../lib/helpers';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};

export const handler = async (req: { httpMethod: any }, context: any) => {
  try {
    await allowedMethods({
      method: req.httpMethod,
      allowedMethods: ['POST'],
    });
    await validateAuthorization(req);
    const body = requestBody(req);

    console.log('🔑 origin', req);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello World!',
        body,
      }),
      headers: HEADERS,
    };
  } catch (error: any) {
    return {
      statusCode: error?.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
      headers: HEADERS,
    };
  }
};
