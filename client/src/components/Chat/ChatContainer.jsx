import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
  const [{ messages, currentChat, userInfo }] = useStateProvider();
  return (
    <div className="relative flex-grow overflow-auto custom-scrollbar h-[80vh] w-full">
      <div className="w-full fixed left-0 top-0 z-0 h-full bg-chat-background opacity-10 bg-fixed"></div>
      <div className="relative z-50 mx-2 my-6 bottom-0 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-2 overflow-ellipsis">
            {messages.map((message, index) => (
              <div
                className={`flex ${
                  message.senderId === currentChat.data.id
                    ? "justify-start"
                    : "justify-end"
                }`}
                key={message.id}
              >
                {message.type === "text" && (
                  <div
                    className={`flex items-end max-w-[100%]  gap-3 text-white py-[8px] px-2 text-sm rounded-md ${
                      message.senderId === currentChat.data.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-words">{message.message}</span>
                    <div className="flex items-end gap-2">
                      <span className="text-bubble-meta text-[11px] min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo.id && (
                          <MessageStatus
                            MessageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
