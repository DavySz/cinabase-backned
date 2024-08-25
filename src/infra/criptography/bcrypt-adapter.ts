import bcrypt from "bcrypt";
import { Encrypter } from "../../data/protocols/encrypter.protocol";

export class BcryptAdapter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12);
    return hash;
  }
}
