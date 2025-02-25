import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter";
import { AccountRepository } from "../../../../infra/database/mongodb/repositories/account/account.repository";
import { SignUpService } from "../../../../presentation/services/sign-up/sign-up.service";
import { EmailValidator } from "../../../../presentation/utils/email-validator";
import { SignUpController } from "../../../controllers/sign-up/sign-up.controller";

export const makeSignUpControllerFactory = (): SignUpController => {
  const encrypter = new BcryptAdapter();
  const addAccount = new AccountRepository();
  const emailValidator = new EmailValidator();
  const service = new SignUpService(addAccount, emailValidator, encrypter);
  return new SignUpController(service);
};
