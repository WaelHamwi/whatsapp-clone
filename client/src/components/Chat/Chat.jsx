import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  return <div className="flex flex-col z-10 h-[100vh] border-l w-full bg-conversation-panel-background border-conversation-border">
    <ChatHeader/>
    <ChatContainer/>
    <MessageBar/>
  </div>;
}

export default Chat;
