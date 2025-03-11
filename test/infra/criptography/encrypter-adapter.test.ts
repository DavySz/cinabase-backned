import { EncrypterAdapter } from "@infra/criptography/encrypter-adapter";
import argon from "argon2";

jest.mock("argon2", () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve("hash"));
  },
  async verify(): Promise<boolean> {
    return await new Promise((resolve) => resolve(true));
  },
}));

const makeSut = (): EncrypterAdapter => new EncrypterAdapter();

describe("EncrypterAdapter", () => {
  describe("encrypt", () => {
    test("Should call hash with correct values", async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(argon, "hash");
      await sut.encrypt("any_value");
      expect(hashSpy).toHaveBeenCalledWith("any_value");
    });

    test("Should hash return correct value", async () => {
      const sut = makeSut();
      const hash = await sut.encrypt("any_value");
      expect(hash).toBe("hash");
    });

    test("Should throw if hash throws", async () => {
      const sut = makeSut();
      jest.spyOn(argon, "hash").mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.encrypt("any_value");
      await expect(promise).rejects.toThrow();
    });
  });

  describe("compare", () => {
    it("should call verify with correct values", async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(argon, "verify");
      await sut.compare("any_value", "any_hash");
      expect(compareSpy).toHaveBeenCalledWith("any_hash", "any_value");
    });

    it("should throw if compare throws", async () => {
      const sut = makeSut();
      jest.spyOn(argon, "verify").mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.compare("any_value", "any_hash");
      await expect(promise).rejects.toThrow();
    });

    it("should return true when compare succeeds", async () => {
      const sut = makeSut();
      const isValid = await sut.compare("any_value", "any_hash");
      expect(isValid).toBe(true);
    });

    it("should return false when compare fails", async () => {
      const sut = makeSut();
      jest.spyOn(argon, "verify").mockImplementationOnce(async () => false);
      const isValid = await sut.compare("any_value", "any_hash");
      expect(isValid).toBe(false);
    });
  });
});
