import { Router } from 'express';
import {getContent, getMatrix} from '../controllers/mainPageControllers.js'


const router = Router();

router.post('/', getMatrix);
router.post('/content', getContent)
//router.post('/', createArcan);
//router.delete('/:id', deleteArcan);
//router.patch('/:id', updateArcan);

export default router