import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import { Error as MongooseError } from "mongoose";

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (isCelebrateError(err)) {
    const messages = Array.from(err.details.values())
      .map((d) => d.message)
      .join("; ");
    return res.status(400).json({ message: messages });
  }

  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ message: "Ошибка валидации данных" });
  }

  if (
    err?.code === 11000 ||
    (err instanceof Error && err.message?.includes("E11000"))
  ) {
    return res
      .status(409)
      .json({ message: "Товар с таким title уже существует" });
  }

  if (err?.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "На сервере произошла ошибка" });
}
