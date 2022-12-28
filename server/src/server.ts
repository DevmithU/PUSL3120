import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import * as mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from './middlewares/auth'
import cors from "cors";
import * as boardsController from "./controllers/boards";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
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
app.get('/api/user', authMiddleware, usersController.currentUser);
app.get("/api/boards", authMiddleware, boardsController.getBoards);
app.post("/api/boards", authMiddleware, boardsController.createBoard);


io.on('connection',()=>{
    console.log("connect");

});
mongoose.connect('mongodb://localhost:27017/mdbt1').then(() =>{
    console.log("connected to mongodb");

    httpServer.listen(4001,() => {
        console.log('API is listening on port 4001');
    });
});

