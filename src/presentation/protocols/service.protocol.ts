import { HttpRequest, HttpResponse } from "./http.protocol";

export interface Service {
  execute: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
