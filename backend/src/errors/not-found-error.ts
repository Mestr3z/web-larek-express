export default class NotFoundError extends Error {
  public statusCode: number;

  constructor(message = "Маршрут не найден") {
    super(message);
    this.statusCode = 404;
  }
}
