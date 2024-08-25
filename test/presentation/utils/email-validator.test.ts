import { EmailValidator } from "../../../src/presentation/utils/email-validator";

const makeSut = (): EmailValidator => new EmailValidator();

describe("EmailValidator", () => {
  test("should return false if email is invalid", () => {
    const sut = makeSut();
    const isValid = sut.isValid("invalid-email");
    expect(isValid).toBe(false);
  });

  test("should return true if email is valid", () => {
    const sut = makeSut();
    const isValid = sut.isValid("teste@gmail.com");
    expect(isValid).toBe(true);
  });
});
