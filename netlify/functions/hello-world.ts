import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '../../lib/helpers';

export const handler = async (req, context) => {
  try {
    await allowedMethods({
      method: req.httpMethod,
      allowedMethods: ['POST'],
    });
    await validateAuthorization(req);
    const body = requestBody(req);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello World!',
        body,
      }),
    };
  } catch (error) {
    return {
      statusCode: error?.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
