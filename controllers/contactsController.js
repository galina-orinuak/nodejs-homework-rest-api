import Contact from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";


const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
  
};

const getById = async (req, res) => {
  
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
  
};

 const add = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } 


const updateById = async (req, res) => {

    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
      throw HttpError(404, `Not found`);
    }

    res.json(result);
  } 

const deleteById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json({
      message: "contact deleted",

    });
  
};



export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),

}