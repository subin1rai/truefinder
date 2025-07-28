import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Settings,
  Smile,
  Paperclip,
  ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Header from "../../components/Header";
import { axiosInstance } from "../../api/baseUrl";
import { toast } from "react-toastify";
import { setSelectedUser } from "../../redux/slice/SelectUser";

export default function MainChat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.selectedUser);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      getUser();
    }
  }, [isAuthenticated]);

  // Fetch messages when selectedChat changes
  useEffect(() => {
    if (selectedChat && user?._id) {
      GetMessage();
    }
  }, [selectedChat, user?._id]);

  const getUser = async () => {
    try {
      const response = await axiosInstance.post("/getUser", {
        currentUserId: user._id,
      });
      const validChats = response.data.filter(
        (chat) => chat._id && chat.firstName
      );
      setChats(validChats);

      // Auto-select first chat if none selected and chats exist
      if (validChats.length > 0 && !selectedChat) {
        const firstChat = validChats[0];
        handleSelect(firstChat._id, firstChat.firstName, firstChat.lastName, firstChat.avatar);
      }

      console.log("Valid chats:", validChats);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const GetMessage = async () => {
    if (!selectedChat || !user?._id) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.post("/message/getMessages", {
        senderId: user._id,
        receiverId: selectedChat,
      });
      const data = response.data.data || [];
      setMessages(data);
      console.log("messages", data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      setMessages([]); // Clear messages on error
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user?._id) return;

    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    try {
      const { data } = await axiosInstance.post("/message/createMessage", {
        senderId: user._id,
        receiverId: selectedChat,
        message: messageText,
      });
      
      console.log("Message sent:", data);
      
      // Add the new message to the messages array immediately
      const newMessageObj = {
        _id: data._id || Date.now().toString(),
        senderId: user._id,
        receiverId: selectedChat,
        message: messageText,
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      setNewMessage(messageText); // Restore message on error
    }
  };

  const handleSelect = (chatId, firstName, lastName, avatar) => {
    dispatch(setSelectedUser({ chatId, firstName, lastName, avatar }));
    setSelectedChat(chatId);
    setMessages([]); // Clear messages when switching chats
    console.log("Selected chat:", chatId);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedChatData = chats.find((chat) => chat._id === selectedChat);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex pt-20 overflow-hidden">
        <div className="w-full px-4 flex gap-6 h-full">
          {/* Chat List - Fixed Width */}
          <div className="w-80 flex-shrink-0">
            <Card className="h-full flex flex-col">
              {/* Chat List Header - Fixed */}
              <CardHeader className="flex-shrink-0 pb-4">
                <CardTitle className="flex items-center justify-between">
                  Messages
                  <Badge variant="secondary">
                    {chats.filter((chat) => chat.unreadCount > 0).length}
                  </Badge>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </CardHeader>

              {/* Chat List Content - Scrollable */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-0">
                    {chats.length > 0 ? (
                      chats.map((chat) => (
                        <div
                          key={chat._id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedChat === chat._id
                              ? "bg-pink-50 border-r-4 border-r-pink-500"
                              : ""
                          }`}
                          onClick={() =>
                            handleSelect(
                              chat._id,
                              chat.firstName,
                              chat.lastName,
                              chat.avatar
                            )
                          }
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative flex-shrink-0">
                              <Avatar>
                                <AvatarImage
                                  src={chat.avatar || "/placeholder.svg"}
                                  alt={`${chat.firstName} ${
                                    chat.lastName || ""
                                  }`}
                                />
                                <AvatarFallback>
                                  {chat.firstName && chat.lastName
                                    ? `${chat.firstName[0]}${chat.lastName[0]}`
                                    : chat.firstName
                                    ? chat.firstName[0]
                                    : "U"}
                                </AvatarFallback>
                              </Avatar>
                              {chat.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-sm truncate">
                                    {chat.firstName} {chat.lastName || ""}
                                  </h3>
                                  {chat.isVerified ? (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200 font-medium"
                                    >
                                      ✓
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-1.5 py-0.5 bg-gray-50 text-gray-500 border-gray-200"
                                    >
                                      ✗
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {chat.lastMessage ||
                                  chat.email ||
                                  "No messages yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No conversations available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area - Flexible Width */}
          <div className="flex-1 min-w-0">
            <Card className="h-full flex flex-col">
              {selectedChatData ? (
                <>
                  {/* Chat Header - Fixed */}
                  <CardHeader className="flex-shrink-0 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={selectedChatData.avatar || "/placeholder.svg"}
                            alt={`${selectedChatData.firstName} ${
                              selectedChatData.lastName || ""
                            }`}
                          />
                          <AvatarFallback>
                            {selectedChatData.firstName &&
                            selectedChatData.lastName
                              ? `${selectedChatData.firstName[0]}${selectedChatData.lastName[0]}`
                              : selectedChatData.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {selectedChatData.firstName}{" "}
                            {selectedChatData.lastName || ""}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedChatData.online
                              ? "Online"
                              : "Last seen recently"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area - Scrollable */}
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {loading ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">Loading messages...</div>
                          </div>
                        ) : messages.length > 0 ? (
                          messages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.userId === user._id
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  message.userId === user._id
                                    ? "bg-pink-500 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <p
                                  className={`text-xs mt-1  ${
                                    message.userId === user._id
                                      ? "text-pink-100 text-end"
                                      : "text-gray-500 text-start"
                                  }`}
                                >
                                  {formatMessageTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">No messages yet. Start the conversation!</div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Message Input - Fixed */}
                  <div className="flex-shrink-0 border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1"
                        disabled={loading}
                      />
                      <Button variant="ghost" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-pink-500 hover:bg-pink-600"
                        size="sm"
                        disabled={!newMessage.trim() || loading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">
                      No chat selected
                    </h3>
                    <p>Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}