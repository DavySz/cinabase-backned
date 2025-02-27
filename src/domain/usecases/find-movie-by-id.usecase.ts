import { MovieModel } from "@domain/models/movie.model";

export interface FindMovieByIdUsecase {
  execute: (movieId: string) => Promise<MovieModel>;
}
