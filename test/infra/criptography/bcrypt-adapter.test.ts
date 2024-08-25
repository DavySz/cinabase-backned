import { BcryptAdapter } from "../../../src/infra/criptography/bcrypt-adapter";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve("hash"));
  },
}));

const makeSut = (): BcryptAdapter => new BcryptAdapter();

describe("BcryptAdapter", () => {
  test("Should call Bcrypt with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });

  test("Should Bcrypt return correct value", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  test("Should throw if bcrypter throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
