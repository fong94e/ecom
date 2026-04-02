import { Router } from "express";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";
import { ShouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", ShouldBeAdmin, createCategory);
router.put("/:id", ShouldBeAdmin, updateCategory);
router.delete("/:id", ShouldBeAdmin, deleteCategory);
router.get("/", getCategories);

export default router;
