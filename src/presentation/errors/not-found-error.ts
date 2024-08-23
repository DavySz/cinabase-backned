export class NotFoundError extends Error {
  constructor(paramName: string) {
    super(`Not Found: ${paramName}`);
    this.name = "NotFoundError";
  }
}
