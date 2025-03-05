import { AddAccountDTO } from "@domain/dtos/add-account.dto";
import { AccountModel } from "@domain/models/account.model";
import { AddAccount } from "@domain/protocols/add-account.protocol";
import { Encrypter } from "@domain/protocols/encrypter.protocol";
import { FindAccountByEmail } from "@domain/protocols/find-account-by-email.protocol";
import { InvalidParamError, MissingParamError } from "@presentation/errors";
import { badRequest, serverError } from "@presentation/helpers/http-helper";
import { Validator } from "@presentation/protocols/validator.protocol";
import { SignUpService } from "@presentation/services/sign-up/sign-up.service";
import { EmailValidator } from "@presentation/utils/email-validator";
import { makeBcryptAdapter } from "@test/mocks/encrypter/encrypter";

interface SutModel {
  emailValidator: EmailValidator;
  findAccountByEmail: FindAccountByEmail;
  bcryptAdapter: Encrypter;
  addAccount: AddAccount;
  sut: SignUpService;
}

const makeAccountModel = (): AccountModel => ({
  id: "any-id",
  name: "any-name",
  email: "any@mail.com",
  password: "any-password",
  createdAt: "any-date",
  updatedAt: "any-date",
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
  class AddAccountRepositoryStub implements AddAccount {
    add(_: AddAccountDTO): Promise<AccountModel> {
      return Promise.resolve(makeAccountModel());
    }
  }

  return new AddAccountRepositoryStub();
};

const makeFindAccountByEmail = (): FindAccountByEmail => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmail {
    find(_: string): Promise<AccountModel> {
      return Promise.resolve({} as AccountModel);
    }
  }

  return new FindAccountByEmailRepositoryStub();
};

const makeSut = (): SutModel => {
  const addAccount = makeAddAccount();
  const findAccountByEmail = makeFindAccountByEmail();
  const bcryptAdapter = makeBcryptAdapter();
  const emailValidator = makeEmailValidator();

  const sut = new SignUpService(
    findAccountByEmail,
    addAccount,
    emailValidator,
    bcryptAdapter
  );

  return {
    findAccountByEmail,
    emailValidator,
    bcryptAdapter,
    addAccount,
    sut,
  };
};

describe("SignUpService", () => {
  test("should return 400 if no field is provided", async () => {
    const { sut } = makeSut();
    const emptyParams = null;
    const response = await sut.execute({ body: emptyParams });
    expect(response).toEqual(badRequest(new MissingParamError("name")));
  });

  test("should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const paramsWithoutName = {
      password: "any-password",
      email: "any-email",
    };
    const response = await sut.execute({ body: paramsWithoutName });
    expect(response).toEqual(badRequest(new MissingParamError("name")));
  });

  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const paramsWithoutEmail = {
      password: "any-password",
      name: "any-name",
    };
    const response = await sut.execute({ body: paramsWithoutEmail });
    expect(response).toEqual(badRequest(new MissingParamError("email")));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const paramsWithoutPassword = {
      email: "any-email",
      name: "any-name",
    };
    const response = await sut.execute({ body: paramsWithoutPassword });
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
    await sut.execute({ body: paramsWithoutPassword });
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
    const response = await sut.execute({ body: paramsWithoutPassword });
    expect(response).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("should call findAccountByEmail.find with correct email", async () => {
    const { sut, findAccountByEmail } = makeSut();
    const findSpy = jest.spyOn(findAccountByEmail, "find");
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    await sut.execute({ body: params });
    expect(findSpy).toHaveBeenCalledWith("any-email");
  });

  test("should return 400 if an account already exists with the provided email", async () => {
    const { sut, findAccountByEmail } = makeSut();
    jest
      .spyOn(findAccountByEmail, "find")
      .mockReturnValueOnce(Promise.resolve(makeAccountModel()));

    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };

    const response = await sut.execute({ body: params });
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
    await sut.execute({ body: params });
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

    const response = await sut.execute({ body: params });
    expect(response).toEqual(serverError(new Error()));
  });

  test("should call AddAccount with correct values", async () => {
    const { sut, addAccount } = makeSut();
    const addSpy = jest.spyOn(addAccount, "add");
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    await sut.execute({ body: params });
    expect(addSpy).toHaveBeenCalledWith({
      name: "any-name",
      email: "any-email",
      password: "hashed-password",
    });
  });

  test("should SignUpController throws an error 500 if AddAccount throws", async () => {
    const { sut, addAccount } = makeSut();
    jest
      .spyOn(addAccount, "add")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    const response = await sut.execute({ body: params });
    expect(response).toEqual(serverError(new Error()));
  });

  test("should return 201 on success", async () => {
    const { sut } = makeSut();
    const params = {
      name: "any-name",
      email: "any-email",
      password: "any-password",
    };
    const response = await sut.execute({ body: params });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(makeAccountModel());
  });
});
