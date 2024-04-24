const expressAsyncHandler = require("express-async-handler");
const user = require("../Models/user");
const chat = require("../Models/chatmodel");
const message = require("../Models/message");
exports.sendMessage=expressAsyncHandler(async(req,res)=>{
    const {content,chatId}=req.body

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newmessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try {
        var Message=await message.create(newmessage)
        
        Message = await Message.populate("sender", "name pic")
        Message = await Message.populate("chat")
        
        Message = await user.populate(Message, {
            path: "chat.users",
            select: "name pic email",
        });

        await chat.findByIdAndUpdate(req.body.chatId, { latestMessage: Message });

        res.json(Message);

    } catch (error) {
        res.status(400);
        console.log(error)
        throw new Error(error.message);
    }
})

exports.allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const Messages = await message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(Messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})