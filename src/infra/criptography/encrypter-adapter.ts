import { Encrypter } from "@domain/protocols/encrypter.protocol";
import argon from "argon2";

export class EncrypterAdapter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return await argon.hash(value);
  }

  async compare(value: string, valueToCompare: string): Promise<boolean> {
    return await argon.verify(valueToCompare, value);
  }
}
