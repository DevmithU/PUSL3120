import {  Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import {Socket} from "../types/socket.interface";
import {SocketEventsEnum} from "../types/socketEvents.enum";
import {getErrorMessage} from "../helpers";
import UserModel from "../models/user";



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