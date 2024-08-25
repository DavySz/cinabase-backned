import { Encrypter } from "../../../data/protocols/encrypter.protocol";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account.usecase";
import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import {
  badRequest,
  created,
  ok,
  serverError,
} from "../../helpers/http-helper";
import { Controller } from "../../protocols/controller.protocol";
import { HttpRequest, HttpResponse } from "../../protocols/http.protocol";
import { EmailValidator } from "../../utils/email-validator";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly emailValidator: EmailValidator,
    private readonly encrypter: Encrypter
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["name", "email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, name, password } = httpRequest.body;

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }

      const hashedPassword = await this.encrypter.encrypt(password);

      const account: AddAccountModel = {
        password: hashedPassword,
        email,
        name,
      };

      const response = await this.addAccount.execute(account);
      return created(response);
    } catch (error: unknown) {
      return serverError(error as Error);
    }
  }
}
