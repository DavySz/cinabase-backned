import { NotFoundError, ServerError } from "@presentation/errors";
import { HttpResponse } from "@presentation/protocols/http.protocol";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const notFound = (id: string): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(id),
});
