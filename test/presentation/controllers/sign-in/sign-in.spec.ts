import { Encrypter } from "../../../../src/data/protocols/encrypter.protocol";
import { AccountModel } from "../../../../src/domain/models/account.model";
import { FindByEmail } from "../../../../src/domain/usecases/find-by-email.usecase";
import { SignInController } from "../../../../src/presentation/controllers/sign-in/sign-in.controller";
import { InvalidParamError } from "../../../../src/presentation/errors/invalid-param-error";
import { MissingParamError } from "../../../../src/presentation/errors/missing-param-error";
import {
  badRequest,
  ok,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { makeBcryptAdapter } from "../../../mocks/encrypter/encrypter";

interface SutModel {
  bcryptAdapter: Encrypter;
  findByEmail: FindByEmail;
  sut: SignInController;
}

class FindByEmailStub implements FindByEmail {
  async execute(_: string): Promise<AccountModel> {
    return Promise.resolve({
      password: "any-password",
      email: "any-email",
      name: "any-name",
      id: "any-id",
    });
  }
}

const makeSut = (): SutModel => {
  const findByEmail = new FindByEmailStub();
  const bcryptAdapter = makeBcryptAdapter();
  const sut = new SignInController(findByEmail, bcryptAdapter);

  return {
    bcryptAdapter,
    findByEmail,
    sut,
  };
};

describe("SignInController", () => {
  it("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const bodyWithoutEmail = {
      password: "any-password",
    };

    const response = await sut.handle({ body: bodyWithoutEmail });
    expect(response).toEqual(badRequest(new MissingParamError("email")));
  });

  it("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const bodyWithoutPassword = {
      email: "any-email",
    };

    const response = await sut.handle({ body: bodyWithoutPassword });
    expect(response).toEqual(badRequest(new MissingParamError("password")));
  });

  it("should return 400 if account not exists", async () => {
    const { sut, findByEmail } = makeSut();

    jest
      .spyOn(findByEmail, "execute")
      .mockResolvedValueOnce({} as AccountModel);

    const body = {
      email: "any-email",
      password: "any-password",
    };

    const response = await sut.handle({ body });

    expect(response).toEqual(
      badRequest(new InvalidParamError("email or password"))
    );
  });

  it("should return 400 if password is invalid", async () => {
    const { sut, bcryptAdapter } = makeSut();
    jest.spyOn(bcryptAdapter, "compare").mockResolvedValueOnce(false);

    const body = {
      email: "any-email",
      password: "invalid-password",
    };

    const response = await sut.handle({ body });

    expect(response).toEqual(
      badRequest(new InvalidParamError("email or password"))
    );
  });

  it("should throws 500 if findByEmail throws", async () => {
    const { sut, findByEmail } = makeSut();
    jest.spyOn(findByEmail, "execute").mockRejectedValueOnce(new Error());

    const body = {
      email: "any-email",
      password: "any-password",
    };

    const response = await sut.handle({ body });
    expect(response).toEqual(serverError(new Error()));
  });

  it("should throws 500 if bcryptAdapter throws", async () => {
    const { sut, bcryptAdapter } = makeSut();
    jest.spyOn(bcryptAdapter, "compare").mockRejectedValueOnce(new Error());

    const body = {
      email: "any-email",
      password: "any-password",
    };

    const response = await sut.handle({ body });
    expect(response).toEqual(serverError(new Error()));
  });

  it("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const body = {
      password: "any-password",
      email: "any-email",
    };

    const response = await sut.handle({ body });

    expect(response).toEqual(
      ok({
        email: "any-email",
        name: "any-name",
        id: "any-id",
      })
    );
  });
});
