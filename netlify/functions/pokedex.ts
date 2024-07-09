import {
  allowedMethods,
  requestBody,
  validateAuthorization,
} from '../../lib/helpers';

const axios = require('axios');

exports.handler = async (req: { httpMethod: any }, context: any) => {
  try {
    await allowedMethods({ method: req.httpMethod, allowedMethods: ['POST'] });
    await validateAuthorization(req);
    const body = requestBody(req);

    const POKE_API = 'https://pokeapi.co/api/v2/pokedex/kanto';
    const { data } = await axios.get(POKE_API);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pokedex',
        data,
        body,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: error?.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
