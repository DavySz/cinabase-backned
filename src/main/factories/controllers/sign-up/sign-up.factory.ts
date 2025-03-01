import { BcryptAdapter } from "@infra/criptography/bcrypt-adapter";
import {
  AddAccountRepository,
  FindAccountByEmailRepository,
} from "@infra/database/mongodb/repositories/account";
import { SignUpController } from "@main/controllers/sign-up/sign-up.controller";
import { SignUpService } from "@presentation/services/sign-up/sign-up.service";
import { EmailValidator } from "@presentation/utils/email-validator";

export const makeSignUpControllerFactory = (): SignUpController => {
  const encrypter = new BcryptAdapter();
  const addAccount = new AddAccountRepository();
  const findAccountByEmail = new FindAccountByEmailRepository();
  const emailValidator = new EmailValidator();
  const service = new SignUpService(
    findAccountByEmail,
    addAccount,
    emailValidator,
    encrypter
  );
  return new SignUpController(service);
};
