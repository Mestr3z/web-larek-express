import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";

export default async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      payment: _payment,
      email: _email,
      phone: _phone,
      address: _address,
      total,
      items,
    } = req.body as {
      payment: "card" | "online";
      email: string;
      phone: string;
      address: string;
      total: number;
      items: string[];
    };

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError("Некоторые товары не найдены"));
    }

    const notForSale = products.find((p) => p.price === null);
    if (notForSale) {
      return next(
        new BadRequestError("В заказе есть товары, которые не продаются")
      );
    }

    const calcTotal = products.reduce((sum, p) => sum + (p.price as number), 0);

    if (calcTotal !== total) {
      return next(new BadRequestError("Сумма заказа не совпадает с total"));
    }

    return res.status(201).json({
      id: faker.string.uuid(),
      total: calcTotal,
    });
  } catch (err) {
    return next(err);
  }
}
