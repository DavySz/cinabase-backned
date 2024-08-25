import { AccountModel } from "../../../../src/domain/models/account.model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../../src/domain/usecases/add-account.usecase";
import { SignUpController } from "../../../../src/presentation/controllers/sign-up/sign-up.controller";
import { InvalidParamError } from "../../../../src/presentation/errors/invalid-param-error";
import { MissingParamError } from "../../../../src/presentation/errors/missing-param-error";
import {
  badRequest,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { Validator } from "../../../../src/presentation/protocols/validator.protocol";
import { EmailValidator } from "../../../../src/presentation/utils/email-validator";
import { Encrypter } from "../../../../src/data/protocols/encrypter.protocol";

interface SutModel {
  emailValidator: EmailValidator;
  bcryptAdapter: Encrypter;
  addAccount: AddAccount;
  sut: SignUpController;
}

const makeAccountModel = (): AccountModel => ({
  id: "any-id",
  name: "any-name",
  email: "any@mail.com",
  password: "any-password",
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements Validator {
    isValid(_: any): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    execute(_: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeAccountModel());
    }
  }

  return new AddAccountStub();
};

const makeBcryptAdapter = (): Encrypter => {
  class BcryptAdapterStub implements Encrypter {
    async encrypt(_: string): Promise<string> {
      return "hashed-password";
    }
  }

  return new BcryptAdapterStub();
};

const makeSut = (): SutModel => {
  const addAccount = makeAddAccount();
  const bcryptAdapter = makeBcryptAdapter();
  const emailValidator = makeEmailValidator();
  const sut = new SignUpController(addAccount, emailValidator, bcryptAdapter);

  return {
    emailValidator,
    bcryptAdapter,
    addAccount,
    sut,
  };
};

describe("SignUpController", () => {
  test("should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const paramsWithoutName = {
      password: "any-password",
      email: "any-email",
    };
    const response = await sut.handle({ body: paramsWithoutName });
    expect(response).toEqual(badRequest(new MissingParamError("name")));
  });

  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const paramsWithoutEmail = {
      password: "any-password",
      name: "any-name",
    };
    const response = await sut.handle({ body: paramsWithoutEmail });
    expect(response).toEqual(badRequest(new MissingParamError("email")));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const paramsWithoutPassword = {
      email: "any-email",
      name: "any-name",
    };
    const response = await sut.handle({ body: paramsWithoutPassword });
    expect(response).toEqual(badRequest(new MissingParamError("password")));
  });

  test("should call emailValidator.isValid with correct email", async () => {
    const { sut, emailValidator } = makeSut();
    const isValidSpy = jest.spyOn(emailValidator, "isValid");
    const paramsWithoutPassword = {
      password: "any-password",
      email: "any-email",
      name: "any-name",
    };
    await sut.handle({ body: paramsWithoutPassword });
    expect(isValidSpy).toHaveBeenCalledWith("any-email");
  });

  test("should return 400 if email is invalid", async () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);
    const paramsWithoutPassword = {
      password: "any-password",
      email: "any-email",
      name: "any-name",
    };
    const response = await sut.handle({ body: paramsWithoutPassword });
    expect(response).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("should call bcryptAdapter.encrypt with correct password", async () => {
    const { sut, bcryptAdapter } = makeSut();
    const encryptSpy = jest.spyOn(bcryptAdapter, "encrypt");
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    await sut.handle({ body: params });
    expect(encryptSpy).toHaveBeenCalledWith("any-password");
  });

  test("should SignUpController throws an error 500 if Encrypter throws", async () => {
    const { sut, bcryptAdapter } = makeSut();
    jest
      .spyOn(bcryptAdapter, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };

    const response = await sut.handle({ body: params });
    expect(response).toEqual(serverError(new Error()));
  });

  test("should call AddAccount with correct values", async () => {
    const { sut, addAccount } = makeSut();
    const addSpy = jest.spyOn(addAccount, "execute");
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    await sut.handle({ body: params });
    expect(addSpy).toHaveBeenCalledWith({
      name: "any-name",
      email: "any-email",
      password: "hashed-password",
    });
  });

  test("should SignUpController throws an error 500 if AddAccount throws", async () => {
    const { sut, addAccount } = makeSut();
    jest
      .spyOn(addAccount, "execute")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    const response = await sut.handle({ body: params });
    expect(response).toEqual(serverError(new Error()));
  });

  test("should return 201 on success", async () => {
    const { sut } = makeSut();
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    const response = await sut.handle({ body: params });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(makeAccountModel());
  });
});
