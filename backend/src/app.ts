import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { errors as celebrateErrors } from "celebrate";

import productRoutes from "./routes/product";
import orderRoutes from "./routes/order";
import NotFoundError from "./errors/not-found-error";
import errorHandler from "./middlewares/error-handler";
import { requestLogger, errorLogger } from "./middlewares/logger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
app.use(express.static(PUBLIC_DIR));
app.use(
  "/images",
  express.static(path.resolve(process.cwd(), "public/images"))
);

app.use(requestLogger);

const mongoUrl = process.env.DB_ADDRESS as string;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

app.use(productRoutes);
app.use(orderRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((req, _res, next) => next(new NotFoundError("Маршрут не найден")));

app.use(errorLogger);

app.use(celebrateErrors());

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
