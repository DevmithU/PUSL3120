import {json, NextFunction, Request, Response} from "express";
import express from "express";
import UserModel from "../models/user";
import { UserDocument } from "../types/user.interface";
import {Error} from "mongoose";
import jwt from "jsonwebtoken";
import { secret } from "../config";
import {MongoError} from "mongodb";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import BoardModel from "../models/board";


const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email },secret,);
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token:`Bearer ${token}`,
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

export const emailAvailable = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
  try {
    // console.log("7");

    const user = await UserModel.findOne({ email: req.params.email });
    console.log(user);

    let status: boolean;
    if (user==null){
      status = true;
    }else {
      status = false;
    }
    res.send(status);

  } catch (err) {
    next(err);
  }
};


export const sampleFunction = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction,
) => {
  let userList

  try {
    userList = req.body.userList;
    console.log(userList);
    // const user = await UserModel.findOne({ email: req.body.email });
    // res.send(user);

  } catch (err) {
    next(err);
  }
};

export const currentUser = (req: ExpressRequestInterface, res: Response) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  res.send(normalizeUser(req.user));
};

