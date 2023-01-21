import {  Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import {Socket} from "../types/socket.interface";
import {SocketEventsEnum} from "../types/socketEvents.enum";
import {getErrorMessage} from "../helpers";
import UserModel from "../models/user";
import WhiteBoardModel from "../models/whiteBoard";



export const joinWhiteBoard = (
    io: Server,
    socket: Socket,
    data: { whiteBoardId: string }
) => {
    console.log("server socket io join", socket.user?.email);
    console.log("server socket io join", data.whiteBoardId);

    //room id given same as board id
    socket.join(data.whiteBoardId);
};
export const leaveWhiteBoard = (
    io: Server,
    socket: Socket,
    data: { whiteBoardId: string }
) => {
    console.log("server socket io join", socket.user?.email);
    console.log("server socket io leave", data.whiteBoardId);
    socket.leave(data.whiteBoardId);
};

export const drawDone = (
    io: Server,
    socket: Socket,
    data: {whiteBoardId: string, x: any, y:any }
) => {
    console.log('--------------*********************')
    io.to(data.whiteBoardId).emit(SocketEventsEnum.ondraw,data)
};

export const mouseDown = (
    io: Server,
    socket: Socket,
    data: {whiteBoardId: string, x: any, y:any }
) => {
    console.log('--------------*********************')
    io.to(data.whiteBoardId).emit(SocketEventsEnum.mouseDownRecieve,data)
};

export const createWhiteBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const newBoard = new WhiteBoardModel({
            title: req.body.title,
            userId: req.user.id,
        });
        const savedBoard = await newBoard.save();
        res.send(savedBoard);
    } catch (err) {
        next(err);
    }
};


export const getWhiteBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        // console.log("11111 board--------")

        const whiteBoard = await BoardModel.findById(req.params.whiteBoardId);
        // console.log("req.params")
        // console.log(req.params);
        // console.log("BOARDS")
        // console.log(board);
        if (!whiteBoard) {
            return res.status(422);
        }
        // console.log(board.userId);
        // console.log("user--",req.user.id);

        const isValidUser =  whiteBoard.validateMember(req.user.id);
        if (!isValidUser) {
            // console.log("not-valid",isValidUser);

            return res.status(422).json({ board: "Not Member of board" });
        }
        // console.log("valid",isValidUser);

        res.send(whiteBoard);
    } catch (err) {
        // console.log("error board--------")

        next(err);
    }
};