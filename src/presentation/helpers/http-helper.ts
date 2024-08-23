import { NotFoundError } from "../errors/not-found-error";
import { ServerError } from "../errors/server-error";
import { HttpResponse } from "../protocols/http.protocol";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const notFound = (id: string): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(id),
});
