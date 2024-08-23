import { MovieModel } from "../../../../src/domain/models/movie.model";
import { AddMovieUsecase } from "../../../../src/domain/usecases/add-movie.usecase";
import { FindMovieByIdUsecase } from "../../../../src/domain/usecases/find-movie-by-id.usecase";
import { AddMovieController } from "../../../../src/presentation/controllers/movie-list/add-movie.controller";
import { MissingParamError } from "../../../../src/presentation/errors/missing-param-error";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { HttpRequest } from "../../../../src/presentation/protocols/http.protocol";

interface SutModel {
  findMovieById: FindMovieByIdUsecase;
  addMovie: AddMovieUsecase;
  sut: AddMovieController;
}

export const makeMovieModel = (): MovieModel => ({
  adult: false,
  backdrop_path: "/path/to/backdrop.jpg",
  budget: 150000000,
  genres: [
    {
      id: 1,
      name: "Action",
    },
    {
      id: 2,
      name: "Adventure",
    },
  ],
  id: 123,
  imdb_id: "tt1234567",
  original_language: "en",
  original_title: "Mock Movie",
  overview: "This is a brief description of the mock movie.",
  popularity: 1500,
  poster_path: "/path/to/poster.jpg",
  production_companies: [
    {
      id: 1,
      logo_path: "/path/to/logo.png",
      name: "Mock Production Company",
      origin_country: "US",
    },
  ],
  production_countries: [
    {
      iso_3166_1: "US",
      name: "United States",
    },
  ],
  release_date: "2024-08-22",
  revenue: 500000000,
  runtime: 120,
  spoken_languages: [
    {
      english_name: "English",
      iso_639_1: "en",
      name: "English",
    },
  ],
  status: "Released",
  title: "Mock Movie",
  video: false,
  vote_average: 8.5,
  vote_count: 12000,
  userId: "user-1234",
});

const makeAddMovieStub = (): AddMovieUsecase => {
  class AddMovieStub implements AddMovieUsecase {
    async execute(_: MovieModel): Promise<MovieModel> {
      return Promise.resolve(makeMovieModel());
    }
  }

  return new AddMovieStub();
};

const makeFindMovieByIdStub = (): FindMovieByIdUsecase => {
  class FindMovieByIdStub implements FindMovieByIdUsecase {
    async execute(_: string): Promise<MovieModel> {
      return Promise.resolve(makeMovieModel());
    }
  }

  return new FindMovieByIdStub();
};

const makeSut = (): SutModel => {
  const addMovie = makeAddMovieStub();
  const findMovieById = makeFindMovieByIdStub();
  const sut = new AddMovieController(addMovie, findMovieById);
  return {
    findMovieById,
    addMovie,
    sut,
  };
};

const makeHttpRequest = (): HttpRequest => ({ params: { id: "123" } });

describe("AddMovieController", () => {
  test("should call findMovieById.execute with correct param", async () => {
    const { sut, findMovieById } = makeSut();
    const executeSpy = jest.spyOn(findMovieById, "execute");
    await sut.handle(makeHttpRequest());
    expect(executeSpy).toHaveBeenCalledWith("123");
  });

  test("should return 400 if no id is provided", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ params: {} });
    expect(response).toEqual(badRequest(new MissingParamError("id")));
  });

  test("should return 404 if movie not found", async () => {
    const { sut, findMovieById } = makeSut();
    jest
      .spyOn(findMovieById, "execute")
      .mockResolvedValueOnce({} as MovieModel);

    const response = await sut.handle(makeHttpRequest());
    expect(response).toEqual(notFound("123"));
  });

  test("should return 500 if findMovieById throws", async () => {
    const { sut, findMovieById } = makeSut();
    jest.spyOn(findMovieById, "execute").mockRejectedValueOnce(new Error());
    const response = await sut.handle(makeHttpRequest());
    expect(response).toEqual(serverError(new Error()));
  });

  test("should return 500 if addMovie throws", async () => {
    const { sut, addMovie } = makeSut();
    jest.spyOn(addMovie, "execute").mockRejectedValueOnce(new Error());
    const response = await sut.handle(makeHttpRequest());
    expect(response).toEqual(serverError(new Error()));
  });

  test("should return 200 on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeHttpRequest());
    expect(response).toEqual(ok(makeMovieModel()));
  });
});
