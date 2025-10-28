import express from "express";
import {
  CreateCategorie,
  GetCategories,
  DeleteCategorie,
  UpdateCategorie,
} from "../controllers/categorieController.js";
import { validate } from "../middlewares/validate.js";
import {
  createCategorieSchema,
  updateCategorieSchema,
} from "../validations/categorie.validations.js";

const router = express.Router();

router.get("/", GetCategories);

router.post("/create", validate(createCategorieSchema), CreateCategorie);

router.put("/update/:id", validate(updateCategorieSchema), UpdateCategorie);

router.delete("/delete/:id", DeleteCategorie);

export default router;
