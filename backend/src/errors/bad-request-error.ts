export default class BadRequestError extends Error {
  public statusCode: number;

  constructor(message = "Переданы некорректные данные") {
    super(message);
    this.statusCode = 400;
  }
}
