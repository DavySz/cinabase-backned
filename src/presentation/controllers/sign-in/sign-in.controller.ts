import { Encrypter } from "../../../data/protocols/encrypter.protocol";
import { AccountModel } from "../../../domain/models/account.model";
import { FindByEmail } from "../../../domain/usecases/find-by-email.usecase";
import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { Controller } from "../../protocols/controller.protocol";
import { HttpRequest, HttpResponse } from "../../protocols/http.protocol";

export class SignInController implements Controller {
  constructor(
    private readonly findByEmail: FindByEmail,
    private readonly encrypter: Encrypter
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
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
