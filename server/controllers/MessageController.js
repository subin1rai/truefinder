import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: `${
          !senderId ? "SenderId " : !receiverId ? "receiverId " : "Message"
        }is required`,
      });
    }

    const newMessage = new Message({
      userId: senderId,
      // receiverId,
      message,
    });
    const saveMessage = await newMessage.save();
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
    });

    if (conversation) {
      conversation = await Conversation.findByIdAndUpdate(
        conversation._id,
        {
          $push: {
            messages: [saveMessage._id],
          },
        },
        { new: true }
      );
    } else {
      conversation = new Conversation({
        members: [senderId, receiverId],
        messages: [saveMessage._id],
      });
      await conversation.save();
    }
    return res.status(200).json({
      sucess: true,
      message: "Message Send Successfully",
      data: {
        newMessage: saveMessage,
        conversation: conversation,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error",
    });
  }
};


export const getMessages= async(req,res)=>{
  try {
    const {senderId, receiverId} = req.body;
  } catch (error) {
    
  }
}