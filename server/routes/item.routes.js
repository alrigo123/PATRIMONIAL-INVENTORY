import { Router } from 'express'
import {
    getAllItems, getItemByCodePat, getItemsByDependece,
    getItemsByWorker, getItemsQtyByDependece, getItemsQtyByWorker
} from '../controllers/getItems.controller.js';

import { searchItems, searchItemsByWorkerAndDescription } from '../controllers/searchItems.controller.js';

import {
    updateDisposition, updateSituation, insertExcelData, getItemByCodePatAndUpdate,
} from '../controllers/handlerItems.controller.js';

const router = Router();

/* ROUTES FOR ITEMS AND SEARCH */

//GET ITEMS
router.get('/', getAllItems)
router.get('/search', searchItems); // Endpoint para la búsqueda en tiempo real
router.get('/worker', getItemsByWorker) //GET ITEMS BY WORKER
router.get('/dependency', getItemsByDependece) //GET ITEMS BY DEPENDENCY
router.get('/filter', searchItemsByWorkerAndDescription) // GET ITEMS BY WORKER AND DESCRIPTION

//GET ITEM BY CODE PATRIMONIAL
router.put('/disposition/:id', updateDisposition);
router.put('/situation/:id', updateSituation);


router.get('/:id', getItemByCodePatAndUpdate)
router.get('/status/:id', getItemByCodePat) // GET ITEMS BY PATRIMONIAL CODE 
// router.get('/:id',getItemByCodePat)

//GET QTY ITEMS
router.get('/worker/qty', getItemsQtyByWorker)
router.get('/dependency/qty', getItemsQtyByDependece)

//POST AN IMPORTED DATA FROM EXCEL
router.post('/imported', insertExcelData);

export default router 