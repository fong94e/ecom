import { Router } from "express";
import {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller";
import { ShouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", ShouldBeAdmin, createProduct);
router.put("/:id", ShouldBeAdmin, updateProduct);
router.delete("/:id", ShouldBeAdmin, deleteProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;
