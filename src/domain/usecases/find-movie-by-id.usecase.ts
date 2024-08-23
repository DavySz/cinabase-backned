import { MovieModel } from "../models/movie.model";

export interface FindMovieByIdUsecase {
  execute: (movieId: string) => Promise<MovieModel>;
}
