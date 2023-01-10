import {  Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import {Socket} from "../types/socket.interface";

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userId: req.user.id });
    res.send(boards);
  } catch (err) {
    next(err);
  }
};

export const getBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    console.log("11111 board--------")

    const board = await BoardModel.findById(req.params.boardId);
    // console.log("req.params")
    // console.log(req.params);
    // console.log("BOARDS")
    // console.log(board);
    if (!board) {
      return res.status(422);
      console.log("no board--------")
    }
    // console.log(board.userId);
    // console.log("user--",req.user.id);

    const isValidUser =  board.validateMember(req.user.id);
    if (!isValidUser) {
      // console.log("not-valid",isValidUser);

      return res.status(422).json({ board: "Not Member of board" });
    }
    // console.log("valid",isValidUser);

    res.send(board);
  } catch (err) {
    console.log("error board--------")

    next(err);
  }
};

export const createBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id,
    });
    const savedBoard = await newBoard.save();
    res.send(savedBoard);
  } catch (err) {
    next(err);
  }
};


export const joinBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
  console.log("server socket io join", socket.user);
  socket.join(data.boardId);
};

export const leaveBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
  console.log("server socket io leave", data.boardId);
  socket.leave(data.boardId);
};
