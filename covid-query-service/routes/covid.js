import express from "express";
import { getByField, insertNew } from "../controllers/covidController.js";

const router = express.Router();

router.get("/buscar/:field/:value", getByField);
router.post("/nuevo", insertNew);

export default router;
