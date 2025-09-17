import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import Product from "../models/product";

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Product.find({});
    return res.json({ items, total: items.length });
  } catch (err) {
    return next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, image, category, description, price } = req.body;

    const created = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).json(created);
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000")) {
      const dup: any = new Error("Товар с таким title уже существует");
      dup.statusCode = 409;
      return next(dup);
    }
    if (error instanceof MongooseError.ValidationError) {
      const bad: any = new Error("Ошибка валидации данных при создании товара");
      bad.statusCode = 400;
      return next(bad);
    }
    return next(error);
  }
};
