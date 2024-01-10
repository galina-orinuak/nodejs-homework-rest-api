import {Schema, model} from "mongoose";
import Joi from "joi";

import {handleSaveError, addUpdateSettings} from "./hooks.js";

const contactSchema =  new Schema ({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
},  {versionKey: false, timestamps: true})

contactSchema.post("save", handleSaveError);
contactSchema.pre ("findOneAndUpdate", addUpdateSettings)
contactSchema.post("findOneAndUpdate", handleSaveError);




export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
      "any.required": `missing required name field`
        }), 
  email: Joi.string().required().messages({
      "any.required": `missing required email field`
        }), 
  phone: Joi.string().required().messages({
      "any.required": `missing required phone field`
        }), 
})

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})

const Contact = model("contact", contactSchema);

export default Contact;