import express from "express";

import contactsController from "../../controllers/contactsController.js";

import {isEmptyBody} from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:id', contactsController.getById)

contactsRouter.post('/', isEmptyBody, contactsController.add)

contactsRouter.delete('/:id', isEmptyBody, contactsController.deleteById)

contactsRouter.put('/:id', contactsController.updateById)

export default contactsRouter;