export function requestBody(req?: any) {
  if (req?.httpMethod === 'GET') {
    return undefined;
  }

  return JSON.parse(req?.body ?? '{}');
}

export async function validateAuthorization(req?: any) {
  // --------------------------------------------------------------------------------
  // 📌  Validate Authorization headers & check bearer token
  // --------------------------------------------------------------------------------
  const authorization = req?.headers?.authorization;

  if (!authorization) {
    throw new CustomError('Unauthorized', 401);
  }

  // --------------------------------------------------------------------------------
  // 📌  Check if the authorization header is valid
  // --------------------------------------------------------------------------------
  const token = authorization.split(' ')[1];
  console.log('🔑 token', token);

  if (!token) {
    throw new CustomError('Unauthorized', 401);
  }
}

class CustomError extends Error {
  // --------------------------------------------------------------------------------
  // 📌  Define custom error type/class
  // --------------------------------------------------------------------------------
  statusCode: number;
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export async function allowedMethods(props: {
  method: string;
  allowedMethods: string[];
}) {
  // --------------------------------------------------------------------------------
  // 📌 OPTIONS
  // --------------------------------------------------------------------------------
  if (!props?.allowedMethods?.includes(props?.method)) {
    throw new CustomError('Method Not Allowed', 405);
  }
}
