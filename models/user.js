import {Schema, model} from "mongoose";
import Joi from "joi";

import {handleSaveError, addUpdateSettings} from "./hooks.js";


const userSchema = new Schema(
    {
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        avatarURL: {
          type: String,
        },
        token: String
      }
  ,  {versionKey: false, timestamps: true})

userSchema.post("save", handleSaveError);
userSchema.pre ("findOneAndUpdate", addUpdateSettings)
userSchema.post("findOneAndUpdate", handleSaveError);


export const userRegisterSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
      "any.required": `missing required password field`
        }), 
    email: Joi.string().required().messages({
      "any.required": `missing required email field`
        }), 
    subscription: Joi.string()

    
})

export const userLoginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required(),
})

const User = model("user", userSchema);

export default User;