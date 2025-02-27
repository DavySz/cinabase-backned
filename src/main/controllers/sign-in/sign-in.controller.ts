import { Controller } from "@main/protocols/controller.protocol";
import { HttpRequest } from "@presentation/protocols/http.protocol";
import { SignInService } from "@presentation/services/sign-in/sign-in.service";
import { Request, Response } from "express";

export class SignInController implements Controller {
  constructor(private readonly signInService: SignInService) {}

  async handle(httpRequest: Request, httpResponse: Response): Promise<void> {
    const dto: HttpRequest = { body: httpRequest.body };
    const serviceResponse = await this.signInService.execute(dto);
    httpResponse.status(serviceResponse.statusCode).json(serviceResponse.body);
  }
}
