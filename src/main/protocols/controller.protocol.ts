import { Request, Response } from "express";

export interface Controller {
  handle: (httpRequest: Request, httpResponse: Response) => Promise<void>;
}
