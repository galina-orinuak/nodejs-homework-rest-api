import express from "express";

import contactsController from "../../controllers/contactsController.js";

// const contactsController = require('../../controllers/contactsController');
// const {isEmptyBody} = require('../../middlewares/index') ;

import {isEmptyBody} from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getById)

contactsRouter.post('/', isEmptyBody, contactsController.add)

contactsRouter.delete('/:contactId', isEmptyBody, contactsController.deleteById)

contactsRouter.put('/:contactId', contactsController.deleteById)

export default contactsRouter;