import { Router } from "express";
import {
  getAllItems,
  getItemByCodePat,
  getItemsQtyByDependece,
  getItemsQtyByWorker,
} from "../controllers/getItems.controller.js";

import {
  searchGeneral,
  searchItemsByWorkerAndDescription,
  searchItemsByWorker,
  searchItemsByDependece,
} from "../controllers/searchItems.controller.js";

import {
  updateDisposition,
  updateSituation,
  insertExcelData,
  getItemByCodePatAndUpdate,
  updateItem,
  addItem
} from "../controllers/handlerItems.controller.js";

const router = Router();

/* ROUTES FOR SEARCH AND GET ITEMS */

//GET REQUEST
router.get("/", getAllItems); // GET ALL ITEMS
router.get("/search", searchGeneral); // Endpoint para la búsqueda en tiempo real
router.get("/worker", searchItemsByWorker); //GET ITEMS BY WORKER
router.get("/dependency", searchItemsByDependece); //GET ITEMS BY DEPENDENCY
router.get("/filter", searchItemsByWorkerAndDescription); // GET ITEMS BY WORKER AND DESCRIPTION
router.get("/:id", getItemByCodePatAndUpdate); // GET ITEMS BY PATRIMONIAL CODE AND UPDATE STATE
router.get("/status/:id", getItemByCodePat); // GET ITEMS BY PATRIMONIAL CODE

//GET QTY ITEMS REQUEST
router.get("/worker/qty", getItemsQtyByWorker);
router.get("/dependency/qty", getItemsQtyByDependece);

//PUT REQUEST
router.put("/disposition/:id", updateDisposition);
router.put("/situation/:id", updateSituation);
router.put("/edit/:id", updateItem);

//POST REQUEST
router.post("/imported", insertExcelData);
router.post("/add", addItem);

export default router;
