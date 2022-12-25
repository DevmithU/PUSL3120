import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import * as mongoose from "mongoose";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
mongoose.set('strictQuery', true);

app.get("/",(req, res)=>{
    res.send("API is UP");
})
io.on('connection',()=>{
    console.log("connect");

});
mongoose.connect('mongodb://localhost:27017/mdbt1').then(() =>{
    console.log("connected to mongodb");

    httpServer.listen(4001,() => {
        console.log('API is listening on port 4001');
    });
});
