import { MovieModel } from "../models/movie.model";

export interface AddMovieUsecase {
  execute: (movie: MovieModel) => Promise<MovieModel>;
}
