import { AccountModel } from "@domain/models/account.model";
import { FindAccountByEmail } from "@domain/protocols/find-account-by-email.protocol";
import { FindAccountByEmailRepository } from "@infra/database/mongodb/repositories/account";
import { User } from "@infra/database/mongodb/schemas/user.schema";

jest.mock("@infra/database/mongodb/schemas/user.schema", () => {
  return {
    User: {
      findOne: jest.fn(() => ({
        exec: jest.fn(() => ({
          toObject: jest.fn(() => ({
            _id: { toHexString: () => "any-id" },
            name: "any-name",
            email: "any-email",
            password: "any-password",
          })),
        })),
      })),
    },
  };
});

export const makeSut = (): FindAccountByEmail => {
  return new FindAccountByEmailRepository();
};

describe("AddAccountRepository", () => {
  it("should call findOne with correct data", async () => {
    const sut = makeSut();
    const findOneSpy = jest.spyOn(User, "findOne");
    await sut.find("any-email");
    expect(findOneSpy).toHaveBeenCalledWith({ email: "any-email" });
  });

  it("should throw if findOne throws", async () => {
    const sut = makeSut();
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(sut.find("any-email")).rejects.toThrow();
  });

  it("should return an empty account if user not exists", async () => {
    const sut = makeSut();

    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      return {
        exec: jest.fn().mockResolvedValue(null),
      } as any;
    });

    const account = await sut.find("any-email");
    expect(account).toEqual({} as AccountModel);
  });

  it("should return an account if user exists", async () => {
    const sut = makeSut();
    const account = await sut.find("any-email");
    expect(account).toEqual({
      id: "any-id",
      name: "any-name",
      email: "any-email",
      password: "any-password",
    });
  });
});
