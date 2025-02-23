import bcrypt from "bcrypt";
import { Encrypter } from "../../data/protocols/encrypter.protocol";

export class BcryptAdapter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, 12);
  }

  async compare(value: string, valueToCompare: string): Promise<boolean> {
    return await bcrypt.compare(value, valueToCompare);
  }
}
