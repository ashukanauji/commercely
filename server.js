import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.status(200).send({ success: true, message: "Server is healthy" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (_req, res) => {
  res.send("<h1>Welcome to the Commercely API</h1>");
});

app.use((req, res) => {
  res.status(404).send({ success: false, message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).send({
    success: false,
    message: error.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE || "development"} mode on ${PORT}`
      .bgCyan.white
  );
});
