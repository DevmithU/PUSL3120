import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import * as mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from './middlewares/auth'
import cors from "cors";
import * as boardsController from "./controllers/boards";
import * as whiteboardsController from "./controllers/whiteBoards";

import * as columnsController from "./controllers/columns";
import {SocketEventsEnum} from "./types/socketEvents.enum";
import jwt from "jsonwebtoken";
import User from "./models/user";
import {Socket} from "./types/socket.interface";
import { secret } from "./config";
import * as tasksController from "./controllers/tasks";
import {getWhiteBoard, updateWhiteBoard} from "./controllers/whiteBoards";
// import {addListUser} from "./controllers/users";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});
mongoose.set('strictQuery', true);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//to tune the '_' for ids in dashBoard, only applies for json messages outside mongodb
mongoose.set("toJSON", {
    virtuals: true,
    transform: (_, converted) => {
        delete converted._id;
    },
});

app.get("/",(req, res)=>{
    res.send("API is UP");
});

app.post("/api/users", usersController.register);
app.post("/api/users/login", usersController.login);
// app.post("/api/users/login2", usersController.sampleFunction);
// app.post("/api/users/login2",authMiddleware,usersController.sampleFunction);
app.get("/api/users/:email", usersController.emailAvailable);
app.post("/api/dashBoard/addListUser", authMiddleware, (req, res, next) => {
    boardsController.addUserList(req, res, next, io);
});
app.post("/api/dashBoard/getListUser", authMiddleware,boardsController.getUserList);
app.post("/api/whiteBoard/addListUser", authMiddleware, (req, res, next) => {
    whiteboardsController.addUserList(req, res, next, io);
});
app.post("/api/whiteBoard/getListUser", authMiddleware,whiteboardsController.getUserList);
app.get("/api/dashBoard/memberWhiteBoards", authMiddleware, whiteboardsController.getMemberWhiteBoards);

app.get('/api/user', authMiddleware, usersController.currentUser);
app.get("/api/dashBoard", authMiddleware, boardsController.getBoards);
app.get("/api/dashBoard/getWB", authMiddleware, boardsController.getWhiteBoards);

app.get("/api/dashBoard/memberBoards", authMiddleware, boardsController.getMemberBoards);

app.get("/api/boards/:boardId", authMiddleware, boardsController.getBoard);
app.get("/api/boards/:boardId/columns", authMiddleware, columnsController.getColumns);
app.get("/api/boards/:boardId/tasks", authMiddleware, tasksController.getTasks);
app.post("/api/dashBoard", authMiddleware, boardsController.createBoard);
app.post("/api/dashBoard/createWB", authMiddleware, whiteboardsController.createWhiteBoard);
app.get("/api/whiteBoards/:whiteBoardId", authMiddleware, whiteboardsController.getWhiteBoard);


io.use(async (socket: Socket, next) => {
    try {
        const token = (socket.handshake.auth.token as string) ?? "";
        const data = jwt.verify(token.split(" ")[1], secret) as {
            id: string;
            email: string;
        };
        const user = await User.findById(data.id);

        if (!user) {
            return next(new Error("Authentication error"));
        }
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
}).on('connection',(socket)=>{

    socket.on(SocketEventsEnum.boardsJoin, (data) => {
        boardsController.joinBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsLeave, (data) => {
        boardsController.leaveBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsCreate, data => {
        columnsController.createColumn(io, socket, data)
    });
    socket.on(SocketEventsEnum.tasksCreate, (data) => {
        tasksController.createTask(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsUpdate, (data) => {
        boardsController.updateBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsDelete, (data) => {
        boardsController.deleteBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsDelete, (data) => {
        columnsController.deleteColumn(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsUpdate, (data) => {
        columnsController.updateColumn(io, socket, data);
    });
    socket.on(SocketEventsEnum.tasksUpdate, (data) => {
        tasksController.updateTask(io, socket, data);
    });
    socket.on(SocketEventsEnum.tasksDelete, (data) => {
        tasksController.deleteTask(io, socket, data);
    });
    socket.on(SocketEventsEnum.dashBoardJoin, (data) => {
        boardsController.joinDashBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.dashBoardLeave, (data) => {
        boardsController.leaveDashBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.whiteBoardJoin, (data) => {
        whiteboardsController.joinWhiteBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.whiteBoardLeave, (data) => {
        whiteboardsController.leaveWhiteBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.drawdone, (data) => {
        whiteboardsController.drawDone(io, socket, data);
    });
    socket.on(SocketEventsEnum.mouseDown, (data) => {
        whiteboardsController.mouseDown(io, socket, data);
    });
    socket.on(SocketEventsEnum.whiteboardsUpdate, (data) => {
        whiteboardsController.updateWhiteBoard(io, socket, data);
    });
    // console.log("connect");
});


mongoose.connect('mongodb://localhost:27017/mdbt1').then(() =>{
    console.log("connected to mongodb");

    httpServer.listen(4001,() => {
        console.log('API is listening on port 4001');
    });
});

export { app };

