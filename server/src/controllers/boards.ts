import {  Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import {Socket} from "../types/socket.interface";
import {SocketEventsEnum} from "../types/socketEvents.enum";
import {getErrorMessage} from "../helpers";
import UserModel from "../models/user";
import TaskModel from "../models/task";
import ColumnModel from "../models/column";

import jwt from "jsonwebtoken";
import WhiteBoardModel from "../models/whiteBoard";
import {secret} from "../config";
import User from "../models/user";
import * as columnsController from "./columns";
import * as tasksController from "./tasks";

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

export const getWhiteBoards = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const whiteBoards = await WhiteBoardModel.find({ userId: req.user.id });
    res.send(whiteBoards);
  } catch (err) {
    next(err);
  }
};

export const getMemberBoards = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userList: { $in: [req.user.id] } });
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
    // console.log("11111 board--------")

    const board = await BoardModel.findById(req.params.boardId);
    // console.log("req.params")
    // console.log(req.params);
    // console.log("BOARDS")
    // console.log(board);
    if (!board) {
      return res.status(422);
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
    // console.log("error board--------")

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

// export const createWhiteBoard = async (
//     req: ExpressRequestInterface,
//     res: Response,
//     next: NextFunction
// ) => {
//   try {
//     if (!req.user) {
//       return res.sendStatus(401);
//     }
//     const newBoard = new WhiteBoardModel({
//       title: req.body.title,
//       userId: req.user.id,
//     });
//     const savedBoard = await newBoard.save();
//     res.send(savedBoard);
//   } catch (err) {
//     next(err);
//   }
// };

export const joinDashBoard = (
    io: Server,
    socket: Socket,
    data: { userId: string }
) => {
  console.log("server socket io join", socket.user?.email);
  console.log("server socket io join", data.userId);

  //room id given same as board id
  socket.join(data.userId);
};
export const leaveDashBoard = (
    io: Server,
    socket: Socket,
    data: { userId: string }
) => {
  console.log("server socket io leave", data.userId);
  console.log("server socket io leave", data.userId);

  socket.leave(data.userId);
};

export const joinBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
  console.log("server socket io join", socket.user?.email);
  console.log("server socket io join", data.boardId);

  //room id given same as board id
  socket.join(data.boardId);
};

export const leaveBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
  console.log("server socket io leave", data.boardId);
  console.log("server socket io leave", data.boardId);

  socket.leave(data.boardId);
};

export const updateBoard = async (
    io: Server,
    socket: Socket,
    data: { boardId: string; fields: { title: string } }
) => {
  try {
    if (!socket.user) {
      socket.emit(
          SocketEventsEnum.boardsUpdateFailure,
          "User is not authorized"
      );
      return;
    }
    const updatedBoard = await BoardModel.findByIdAndUpdate(
        data.boardId,
        data.fields,
        { new: true }
    );
    io.to(data.boardId).emit(
        SocketEventsEnum.boardsUpdateSuccess,
        updatedBoard
    );
  } catch (err) {
    socket.emit(SocketEventsEnum.boardsUpdateFailure, getErrorMessage(err));
  }
};

export const deleteBoard = async (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
          SocketEventsEnum.boardsDeleteFailure,
          "User is not authorized"
      );
      return;
    }
    await BoardModel.deleteOne({ _id: data.boardId });
    await TaskModel.deleteMany({ boardId: data.boardId });
    await ColumnModel.deleteMany({ boardId: data.boardId });

    io.to(data.boardId).emit(SocketEventsEnum.boardsDeleteSuccess);
  } catch (err) {
    socket.emit(SocketEventsEnum.boardsDeleteFailure, getErrorMessage(err));
  }
};

export const addUserList = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction,
    io:Server,
) => {
  let userEmailList = [];
  let newuserEmailList = [];
  let userIdList = [];
  try {
    // console.log("7");
    console.log('///////////////////////////////////////////');

    userEmailList = req.body.userList;
    // console.log(userList);
    // res.send(userEmailList);
    for (let i in userEmailList){
      const user = await UserModel.findOne({ email: userEmailList[i] });
      userIdList[+i] = user?.id;
      //

    }
    // console.log(userList);
    const updatedBoard = await BoardModel.findByIdAndUpdate(
        req.body.boardId,
        { userList: userIdList },
        { new: true }
    );
    for (let i in userIdList){
      const userId = userIdList[i];
      const boards = await BoardModel.find({ userList: { $in: [userId] } });
      io.to(userId).emit(SocketEventsEnum.addMemberSuccess,boards);


    }

    for (let i in updatedBoard?.userList) {

      const user = await UserModel.findById(updatedBoard?.userList[parseInt(i)]);
      newuserEmailList[+i] = user?.email;
    }
    console.log('userEmailList',userEmailList);

    console.log('updatedBoard',updatedBoard);
    console.log('newuserEmailList',newuserEmailList);
    console.log('///////////////////////////////////////////');


    res.send(newuserEmailList)



  } catch (err) {
    next(err);
  }
};

export const getUserList = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
  // let userList = [];
  let boardId;
  let userIdList;
  let userEmailList = [] ;
  try {
    // console.log("7");

    boardId = req.body.boardId;
    const board = await BoardModel.findById(boardId);

    // console.log(boardId);

    userIdList = board?.userList;
    // console.log(userIdList);

    // console.log(userList);
    // res.send(userEmailList);
    for (let i in userIdList) {

      const user = await UserModel.findById(userIdList[parseInt(i)]);
      userEmailList[+i] = user?.email;
    }
    res.send(userEmailList)


    // console.log(req.params);

  } catch (err) {
    next(err);
  }
};