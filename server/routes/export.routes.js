import { Router } from 'express'

import { getItemsGeneralDisposition, getItemsGeneralState,
    getItemsStateTrue, getItemsStateFalse, getItemsDispositionTrue, getItemsDispositionFalse
 } from '../controllers/exportReports.controller.js';

const router = Router();

//EXPORT DATA TO EXCEL
router.get('/state', getItemsGeneralState);
router.get('/state/true', getItemsStateTrue);
router.get('/state/false', getItemsStateFalse);

router.get('/disposition', getItemsGeneralDisposition);
router.get('/disposition/true', getItemsDispositionTrue);
router.get('/disposition/false', getItemsDispositionFalse); 


export default router 