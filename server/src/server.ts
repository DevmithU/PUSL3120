import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import * as mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from './middlewares/auth'
import cors from "cors";
import * as boardsController from "./controllers/boards";
import * as columnsController from "./controllers/columns";
import {SocketEventsEnum} from "./types/socketEvents.enum";
import jwt from "jsonwebtoken";
import User from "./models/user";
import {Socket} from "./types/socket.interface";
import { secret } from "./config";


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

//to tune the '_' for ids in boards, only applies for json messages outside mongodb
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
app.get("/api/users/:email", usersController.emailAvailable);

app.get('/api/user', authMiddleware, usersController.currentUser);
app.get("/api/boards", authMiddleware, boardsController.getBoards);
app.get("/api/boards/:boardId", authMiddleware, boardsController.getBoard);
app.get(    "/api/boards/:boardId/columns", authMiddleware, columnsController.getColumns);
app.post("/api/boards", authMiddleware, boardsController.createBoard);


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
    // console.log("connect");
});


mongoose.connect('mongodb://localhost:27017/mdbt1').then(() =>{
    console.log("connected to mongodb");

    httpServer.listen(4001,() => {
        console.log('API is listening on port 4001');
    });
});

