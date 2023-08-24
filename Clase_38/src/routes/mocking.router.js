import { Router } from "express";
import { generateProducts } from "../mocks/products.mocks.js";

const router = Router();

export default router;

router.get("/", (req, res) => {
  const products = [];
  try {
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }
    res.send({ status: "success", payload: products });
  } catch (error) {
    console.log(error);
  }
});