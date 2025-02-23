import { Encrypter } from "../../../src/data/protocols/encrypter.protocol";

export const makeBcryptAdapter = (): Encrypter => {
  class BcryptAdapterStub implements Encrypter {
    async encrypt(_: string): Promise<string> {
      return "hashed-password";
    }

    async compare(_: string, __: string): Promise<boolean> {
      return true;
    }
  }

  return new BcryptAdapterStub();
};
