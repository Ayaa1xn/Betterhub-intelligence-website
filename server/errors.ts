import type express from 'express';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function badRequest(message: string) {
  return new HttpError(400, message);
}

export function unauthorized(message = 'Unauthorized.') {
  return new HttpError(401, message);
}

export function forbidden(message = 'Forbidden.') {
  return new HttpError(403, message);
}

export function tooManyRequests(message = 'Too many requests. Please try again later.') {
  return new HttpError(429, message);
}

export function asyncHandler(
  handler: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => Promise<unknown> | unknown,
) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
