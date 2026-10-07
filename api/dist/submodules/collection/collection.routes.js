import { Router } from 'express';
import { handleGetCollection, handleSaveCollection, handleDeleteCollection } from './collection.controller.js';
const collectionRouter = Router();
collectionRouter.get('/', handleGetCollection);
collectionRouter.post('/', handleSaveCollection);
collectionRouter.delete('/:id', handleDeleteCollection);
export { collectionRouter };
