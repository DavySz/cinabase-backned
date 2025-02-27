import { BcryptAdapter } from "@infra/criptography/bcrypt-adapter";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve("hash"));
  },
  async compare(): Promise<boolean> {
    return await new Promise((resolve) => resolve(true));
  },
}));

const makeSut = (): BcryptAdapter => new BcryptAdapter();

describe("BcryptAdapter", () => {
  describe("encrypt", () => {
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

  describe("compare", () => {
    it("should call bcrypt.compare with correct values", async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, "compare");
      await sut.compare("any_value", "any_hash");
      expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
    });

    it("should throw if compare throws", async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
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
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(async () => false);
      const isValid = await sut.compare("any_value", "any_hash");
      expect(isValid).toBe(false);
    });
  });
});
