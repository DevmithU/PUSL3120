import {NextFunction, Response} from "express";
import {ExpressRequestInterface} from "../types/expressRequest.interface";
import {SocketEventsEnum} from "../types/socketEvents.enum";
import {Socket} from "../types/socket.interface";
import {Server} from "socket.io";
import ChatModel from "../models/chat";
import UserModel from "../models/user";


export const newMessage = async (
    io: Server,
    socket: Socket,
    data: {  text: string,boardId: string,userId:string }
) => {
    try {
        console.log('////////////////////////////////')
        if (!socket.user) {
            socket.emit(
                SocketEventsEnum.columnsCreateFailure,
                "User is not authorized"
            );
            return;
        }
        console.log('111111111111111111111111111')

        const newMessage = new ChatModel({
            text: data.text,
            boardId: data.boardId,
            userId: socket.user.id,
        });
        console.log('newwwwwwwwwwwwwwwwwww',newMessage)
        const savedMessage = await newMessage.save();
        let user = await UserModel.findById(savedMessage.userId);
        let newChat = {
            userId: savedMessage.userId,
            userName: user?.username,
            // boardId: chatMessage.boardId.toString(),
            text: savedMessage.text
        };
        io.to(data.boardId).emit(
            SocketEventsEnum.newChatMessageSuccess,
            newChat
        );
        console.log("emitting message", newChat);
    } catch (err) {
        // socket.emit(SocketEventsEnum.columnsCreateFailure, getErrorMessage(err));
    }
};

export const getChats = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {

    let chatList = [];
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        let chats = await ChatModel.find({ boardId: req.params.boardId });

        for (let chatMessage of chats) {
            let user = await UserModel.findById(chatMessage.userId);
            let chat = {
                userId: chatMessage.userId,
                userName: user?.username || "Unknown",
                // boardId: chatMessage.boardId.toString(),
                text: chatMessage.text
            };
            chatList.push(chat);
        }
        console.log('////////////////////////',chatList);

        res.send(chatList);
    } catch (err) {
        next(err);
    }
};