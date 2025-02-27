import { AddAccountRepository } from "@domain/protocols/add-account.protocol";
import { Encrypter } from "@domain/protocols/encrypter.protocol";
import { AddAccountModel } from "@domain/usecases/add-account.usecase";
import { InvalidParamError, MissingParamError } from "@presentation/errors";
import {
  created,
  badRequest,
  serverError,
} from "@presentation/helpers/http-helper";
import {
  HttpRequest,
  HttpResponse,
} from "@presentation/protocols/http.protocol";
import { Service } from "@presentation/protocols/service.protocol";
import { EmailValidator } from "@presentation/utils/email-validator";

export class SignUpService implements Service {
  constructor(
    private readonly addAccount: AddAccountRepository,
    private readonly emailValidator: EmailValidator,
    private readonly encrypter: Encrypter
  ) {}

  async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["name", "email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
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

      const response = await this.addAccount.add(account);
      return created(response);
    } catch (error: unknown) {
      return serverError(error as Error);
    }
  }
}
