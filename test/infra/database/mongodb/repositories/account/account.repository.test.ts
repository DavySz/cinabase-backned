import { AddAccountDTO } from "@domain/dtos/add-account.dto";
import { AccountRepository } from "@infra/database/mongodb/repositories/account/account.repository";
import { User } from "@infra/database/mongodb/schemas/user.schema";

jest.mock("@infra/database/mongodb/schemas/user.schema", () => {
  return {
    User: {
      create: jest.fn(() =>
        Promise.resolve({
          _id: { toHexString: () => "any-id" },
          password: "hashed-password",
          email: "any-email",
          name: "any-name",
        })
      ),
    },
  };
});

const addAccountModelDTO: AddAccountDTO = {
  password: "any-password",
  email: "any-email",
  name: "any-name",
};

export const makeSut = (): AccountRepository => {
  return new AccountRepository();
};

describe("AccountRepository", () => {
  it("should call create with correct data", async () => {
    const sut = makeSut();
    const createSpy = jest.spyOn(User, "create");
    await sut.add(addAccountModelDTO);
    expect(createSpy).toHaveBeenCalledWith(addAccountModelDTO);
  });

  it("should throw if create throws", async () => {
    const sut = makeSut();
    jest.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(sut.add(addAccountModelDTO)).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const sut = makeSut();
    const account = await sut.add(addAccountModelDTO);
    expect(account).toEqual({
      id: "any-id",
      password: "hashed-password",
      email: "any-email",
      name: "any-name",
    });
  });
});
