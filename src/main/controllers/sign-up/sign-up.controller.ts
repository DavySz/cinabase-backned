import { Request, Response } from "express";
import { SignUpService } from "../../../presentation/services/sign-up/sign-up.service";
import { HttpRequest } from "../../../presentation/protocols/http.protocol";
import { Controller } from "../../protocols/controller.protocol";

export class SignUpController implements Controller {
  constructor(private readonly signUpService: SignUpService) {}

  async handle(httpRequest: Request, httpResponse: Response): Promise<void> {
    const dto: HttpRequest = { body: httpRequest.body };
    const serviceResponse = await this.signUpService.execute(dto);
    httpResponse.status(serviceResponse.statusCode).json(serviceResponse.body);
  }
}
