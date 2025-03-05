import { AccountModel } from "@domain/models/account.model";
import { Encrypter } from "@domain/protocols/encrypter.protocol";
import { InvalidParamError, MissingParamError } from "@presentation/errors";
import { badRequest, ok, serverError } from "@presentation/helpers/http-helper";
import {
  HttpRequest,
  HttpResponse,
} from "@presentation/protocols/http.protocol";
import { Service } from "@presentation/protocols/service.protocol";
import { FindAccountByEmail } from "@domain/protocols/find-account-by-email.protocol";

export class SignInService implements Service {
  constructor(
    private readonly findByEmail: FindAccountByEmail,
    private readonly encrypter: Encrypter
  ) {}

  async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;

      const account = await this.findByEmail.find(email);

      if (!account.id) {
        return badRequest(new InvalidParamError("email or password"));
      }

      const isValidPassword = await this.encrypter.compare(
        account.password,
        password
      );

      if (!isValidPassword) {
        return badRequest(new InvalidParamError("email or password"));
      }

      const accountWithoutPassword: Partial<AccountModel> = {
        email: account.email,
        name: account.name,
        id: account.id,
      };

      return ok(accountWithoutPassword);
    } catch (error: unknown) {
      return serverError(error as Error);
    }
  }
}
