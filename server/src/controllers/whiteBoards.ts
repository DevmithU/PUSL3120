import {  Response, NextFunction } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import {Socket} from "../types/socket.interface";
import {SocketEventsEnum} from "../types/socketEvents.enum";
import {getErrorMessage} from "../helpers";
import UserModel from "../models/user";
import WhiteBoardModel from "../models/whiteBoard";
import BoardModel from "../models/board";



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
    io.to(data.whiteBoardId).emit(SocketEventsEnum.mouseDownReceive,data)
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

        const whiteBoard = await WhiteBoardModel.findById(req.params.whiteBoardId);
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


export const getUserList = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
    // let userList = [];
    let whiteBoardId;
    let userIdList;
    let userEmailList = [] ;
    try {
        // console.log("7");

        whiteBoardId = req.body.whiteBoardId;
        const whiteBoard = await WhiteBoardModel.findById(whiteBoardId);

        // console.log(boardId);

        userIdList = whiteBoard?.userList;
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
        const updatedWhiteBoard = await WhiteBoardModel.findByIdAndUpdate(
            req.body.whiteBoardId,
            { userList: userIdList },
            { new: true }
        );
        for (let i in userIdList){
            const userId = userIdList[i];
            const whiteBoards = await WhiteBoardModel.find({ userList: { $in: [userId] } });
            io.to(userId).emit(SocketEventsEnum.addMemberSuccessWB,whiteBoards);


        }

        for (let i in updatedWhiteBoard?.userList) {

            const user = await UserModel.findById(updatedWhiteBoard?.userList[parseInt(i)]);
            newuserEmailList[+i] = user?.email;
        }
        console.log('userEmailList',userEmailList);

        console.log('updatedWhiteBoard',updatedWhiteBoard);
        console.log('newuserEmailList',newuserEmailList);
        console.log('///////////////////////////////////////////');


        res.send(newuserEmailList)



    } catch (err) {
        next(err);
    }
};


export const getMemberWhiteBoards = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const whiteBoards = await WhiteBoardModel.find({ userList: { $in: [req.user.id] } });
        res.send(whiteBoards);
    } catch (err) {
        next(err);
    }
};


export const updateWhiteBoard = async (
    io: Server,
    socket: Socket,
    data: { whiteBoardId: string; fields: { title: string } }
) => {
    try {
        if (!socket.user) {
            socket.emit(
                SocketEventsEnum.whiteboardsUpdateSuccess,
                "User is not authorized"
            );
            return;
        }
        const updatedWhiteBoard = await WhiteBoardModel.findByIdAndUpdate(
            data.whiteBoardId,
            data.fields,
            { new: true }
        );
        io.to(data.whiteBoardId).emit(
            SocketEventsEnum.whiteboardsUpdateSuccess,
            updatedWhiteBoard
        );
    } catch (err) {
        socket.emit(SocketEventsEnum.whiteboardsUpdateFailure, getErrorMessage(err));
    }
};
