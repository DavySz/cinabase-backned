import { AccountModel } from "../../../domain/models/account.model";
import { Encrypter } from "../../../domain/protocols/encrypter.protocol";
import { FindByEmail } from "../../../domain/usecases/find-by-email.usecase";
import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http.protocol";
import { Service } from "../../protocols/service.protocol";

export class SignInService implements Service {
  constructor(
    private readonly findByEmail: FindByEmail,
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

      const account = await this.findByEmail.execute(email);

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
