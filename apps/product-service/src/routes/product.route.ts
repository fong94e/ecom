import { Router } from "express";
import {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;

