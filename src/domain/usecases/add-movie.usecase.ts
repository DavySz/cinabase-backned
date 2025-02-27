import { MovieModel } from "@domain/models/movie.model";

export interface AddMovieUsecase {
  execute: (movie: MovieModel) => Promise<MovieModel>;
}
