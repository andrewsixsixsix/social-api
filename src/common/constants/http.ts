export const enum HttpHeader {
  AUTHORIZATION = 'Authorization',
  CONTENT_LOCATION = 'Content-Location',
}

export const enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_CONTENT = 422,
  INTERNAL_SERVER_ERROR = 500,
}
