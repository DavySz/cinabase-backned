import { Request, Response } from "express";
import { HttpRequest } from "../../../presentation/protocols/http.protocol";
import { Controller } from "../../protocols/controller.protocol";
import { AddMovieService } from "../../../presentation/services/movie-list/add-movie.service";

export class AddMovieController implements Controller {
  constructor(private readonly addMovieService: AddMovieService) {}

  async handle(httpRequest: Request, httpResponse: Response): Promise<void> {
    const dto: HttpRequest = { body: httpRequest.body };
    const serviceResponse = await this.addMovieService.execute(dto);
    httpResponse.status(serviceResponse.statusCode).json(serviceResponse.body);
  }
}
