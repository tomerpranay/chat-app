const express= require('express');
const app=express();
const dotenv=require("dotenv")
dotenv.config()
const cors = require('cors')
const port=process.env.PORT || 8000
const {notFound,errorHandler}=require("./middleware/errorMiddleware.js")
const {chats} = require("./Data/data.js");
const { connectDB } = require('./config/db.js');
const userroutes =require('./routes/userroutes.js')
const chatroutes=require('./routes/chatroutes.js')
const messageroutes = require('./routes/messageroutes.js')
connectDB()
app.use(cors({
    origin: "*",
    credential: true
}))
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Api started")
})
app.use("/api/user",userroutes)
app.use("/api/chat", chatroutes)
app.use("/api/message", messageroutes)
app.use(notFound);
app.use(errorHandler);
const server=app.listen(port,console.log(`Server started om port ${port}`))
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"*"
    }
})
io.on("connection",(socket)=>{
    console.log("connected to socket")
    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        socket.emit('connected')

    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User joined room "+room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessage)=>{
        var chat=newMessage.chat
        if(!chat.users){
            return console.log("chat.users not defined")
        }
        chat.users.forEach(user=>{
            if(user._id==newMessage.sender._id) return 
            socket.in(user._id).emit("message recieved",newMessage)
        })

    })
    socket.on("disconnect", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})