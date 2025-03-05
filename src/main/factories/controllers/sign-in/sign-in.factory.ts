import { BcryptAdapter } from "@infra/criptography/bcrypt-adapter";
import { FindAccountByEmailRepository } from "@infra/database/mongodb/repositories/account";
import { SignInController } from "@main/controllers/sign-in/sign-in.controller";
import { SignInService } from "@presentation/services/sign-in/sign-in.service";

export const makeSignInControllerFactory = (): SignInController => {
  const encrypter = new BcryptAdapter();
  const findAccountByEmail = new FindAccountByEmailRepository();
  const service = new SignInService(findAccountByEmail, encrypter);
  return new SignInController(service);
};
