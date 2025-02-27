import {
  HttpRequest,
  HttpResponse,
} from "@presentation/protocols/http.protocol";

export interface Service {
  execute: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
