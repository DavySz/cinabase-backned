import { AccountModel } from "../../../../domain/models/account.model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../../domain/usecases/add-account.usecase";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter";
import { SignUpService } from "../../../../presentation/services/sign-up/sign-up.service";
import { EmailValidator } from "../../../../presentation/utils/email-validator";
import { SignUpController } from "../../../controllers/sign-up/sign-up.controller";

class TempAddAccount implements AddAccount {
  execute(_: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve({
      email: "valid_email",
      id: "valid_id",
      name: "valid_name",
      password: "valid_password",
    });
  }
}

export const makeSignUpControllerFactory = (): SignUpController => {
  const encrypter = new BcryptAdapter();
  const addAccount = new TempAddAccount();
  const emailValidator = new EmailValidator();
  const service = new SignUpService(addAccount, emailValidator, encrypter);
  return new SignUpController(service);
};
