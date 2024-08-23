import { AddMovieUsecase } from "../../../domain/usecases/add-movie.usecase";
import { FindMovieByIdUsecase } from "../../../domain/usecases/find-movie-by-id.usecase";
import { MissingParamError } from "../../errors/missing-param-error";
import {
  ok,
  notFound,
  badRequest,
  serverError,
} from "../../helpers/http-helper";
import { Controller } from "../../protocols/controller.protocol";
import { HttpRequest, HttpResponse } from "../../protocols/http.protocol";

export class AddMovieController implements Controller {
  constructor(
    private readonly addMovie: AddMovieUsecase,
    private readonly findMovieById: FindMovieByIdUsecase
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return badRequest(new MissingParamError("id"));
      }

      const movie = await this.findMovieById.execute(id);

      if (!movie.id) {
        return notFound(id);
      }

      const response = await this.addMovie.execute(movie);
      return ok(response);
    } catch (error: unknown) {
      return serverError(error as Error);
    }
  }
}
