import { Router } from 'express'
import {
    getAllItems, getItemByCodePat,
    getItemsQtyByDependece, getItemsQtyByWorker
} from '../controllers/getItems.controller.js';

import { searchGeneral, searchItemsByWorkerAndDescription,
    searchItemsByWorker, searchItemsByDependece
 } from '../controllers/searchItems.controller.js';

import {
    updateDisposition, updateSituation, insertExcelData, getItemByCodePatAndUpdate,
    updateItem
} from '../controllers/handlerItems.controller.js';

const router = Router();

/* ROUTES FOR ITEMS AND SEARCH */

//GET ITEMS
router.get('/', getAllItems)
router.get('/search', searchGeneral); // Endpoint para la búsqueda en tiempo real
router.get('/worker', searchItemsByWorker) //GET ITEMS BY WORKER
router.get('/dependency', searchItemsByDependece) //GET ITEMS BY DEPENDENCY
router.get('/filter', searchItemsByWorkerAndDescription) // GET ITEMS BY WORKER AND DESCRIPTION

router.get('/:id', getItemByCodePatAndUpdate)
router.get('/status/:id', getItemByCodePat) // GET ITEMS BY PATRIMONIAL CODE 
// router.get('/:id',getItemByCodePat)

//GET QTY ITEMS
router.get('/worker/qty', getItemsQtyByWorker)
router.get('/dependency/qty', getItemsQtyByDependece)

//GET ITEM BY CODE PATRIMONIAL
router.put('/disposition/:id', updateDisposition);
router.put('/situation/:id', updateSituation);
router.put('/edit/:id', updateItem);  


//POST AN IMPORTED DATA FROM EXCEL
router.post('/imported', insertExcelData);

export default router;