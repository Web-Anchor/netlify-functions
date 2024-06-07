import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '../../lib/helpers';

export const handler = async (request, context) => {
  try {
    await allowedMethods({
      method: request.httpMethod,
      allowedMethods: ['POST'],
    });
    await validateAuthorization(request);
    const body = requestBody(request);

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
