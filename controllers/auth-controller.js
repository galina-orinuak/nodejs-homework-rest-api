import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "path";
import { nanoid } from "nanoid";

import User from "../models/user.js";

import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET, ELASTIC_API_KEY } = process.env;

const avatarDes = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken});

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${ELASTIC_API_KEY}/api/auth/verify/${verificationToken}">Click here to verify Email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json(
   {user: {
    email: newUser.email,
    subscription: newUser.subscription
  }});
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
        email: user.email,
        subscription: user.subscription
      }
    
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const current = async(req, res)=> {
    const {subscription, email} = req.user;

    res.json({
        email,
        subscription
    })
  };

  const patchAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDes, filename);
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
  
    await User.findByIdAndUpdate(_id, { avatarURL });
  
  Jimp.read(`${avatarDes}/${filename}`,(err,fileAvatar) => {
    if (err) throw err
    fileAvatar
    .cover(250,250)
    .write(`${avatarDes}/${filename}`) 
  })
  
    res.json({
      avatarURL,
    });
  };

  const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: "",
      verify: true,
    });
  
    res.status(200).json({
      message: "Verification successful",
    });
  };


  const resetVerify = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      throw HttpError(401);
    }
  
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
  
    const verifyEmail = {
      to: email,
      subject: "Verify Email",
      html: `<a target="_blank" href="${ELASTIC_API_KEY}/api/auth/verify/${user.verificationToken}">Click here to verify Email</a>`,
    };
  
    await sendEmail(verifyEmail);
  
    res.status(200).json({
      message: "Verification email sent",
    });
  
  };

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  patchAvatar: ctrlWrapper(patchAvatar),
  verify: ctrlWrapper(verify),
  resetVerify: ctrlWrapper(resetVerify)
};
