import express from "express";

import contactsController from '../../controllers/contactsController.js';
import {isEmptyBody, isValidId, isEmptyBodyFav} from '../../middlewares/index.js';
import validateBody from '../../decorators/validateBody.js';
import { contactAddSchema, contactUpdateSchema } from '../../models/contacts.js';

const router = express.Router()

router.get('/', contactsController.getAll);

router.get('/:id', isValidId, contactsController.getById);

router.post('/', isEmptyBody, validateBody(contactAddSchema), contactsController.add)

router.delete('/:id', isValidId, contactsController.deleteById)

router.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById)

router.patch("/:id/favorite", isValidId, isEmptyBodyFav, validateBody(contactUpdateSchema), contactsController.updateById)

export default router;
