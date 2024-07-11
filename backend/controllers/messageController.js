import {Conversation} from "../DB/conversitionSchema.js"
import {Message} from "../DB/messageModel.js"
import { getReceiverSocketId,io} from "../socket/socket.js";

export const sendMessage = async(req,res)=>{
    try{
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}});

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId],
            })
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message:req.body.data,
            url:req.body.url,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        // await newMessage.save();
        // await conversation.save();
        await Promise.all([conversation.save(),newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(200).json(newMessage);
    }
    catch(error){
        return res.status(401).json({error});
    }
}

export const getMessage = async(req,res)=>{
    try{
        const {id:userToChat} = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChat]},
        }).populate("messages");

        if(!conversation) return res.status(200).json([]);
        const message = conversation.messages;
        res.status(200).json(message);
    }
    catch(error){
        return res.status(500).json({error})
    }
}