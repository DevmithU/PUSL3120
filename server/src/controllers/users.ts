import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";
import { UserDocument } from "../types/user.interface";
import {Error} from "mongoose";
import jwt from "jsonwebtoken";
import { secret } from "../config";
import {MongoError} from "mongodb";
const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email },secret);
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    //console.log("newUser",newUser);
    const savedUser = await newUser.save();
    //console.log("savedUser",savedUser);
    res.send(normalizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }
    if ((err as MongoError).code === 11000) {
      return res.status(409).json({ message: "Email in use" });
    }
    next(err);
  }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select("+password"    );
    const errors = { emailOrPassword: "Incorrect email or password" };

    if (!user) {
      return res.status(422).json(errors);
    }

    const isSamePassword =  user.validatePassword(req.body.password);

    if (!isSamePassword) {
      return res.status(422).json(errors);
    }

    res.send(normalizeUser(user));
  } catch (err) {
    next(err);
  }
};
