import { AddMovieUsecase } from "@domain/usecases/add-movie.usecase";
import { FindMovieByIdUsecase } from "@domain/usecases/find-movie-by-id.usecase";
import { MissingParamError } from "@presentation/errors";
import {
  ok,
  notFound,
  badRequest,
  serverError,
} from "@presentation/helpers/http-helper";
import {
  HttpRequest,
  HttpResponse,
} from "@presentation/protocols/http.protocol";
import { Service } from "@presentation/protocols/service.protocol";

export class AddMovieService implements Service {
  constructor(
    private readonly addMovie: AddMovieUsecase,
    private readonly findMovieById: FindMovieByIdUsecase
  ) {}

  async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
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
