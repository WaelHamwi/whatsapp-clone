import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem(data, isContact = false) {
  const [{ userInfo, currentChat }, dispatch] = useStateProvider();
  console.log(data.data);
  console.log(data);
  console.log(data.data.messageStatus);
  console.log(userInfo.id);
  console.log(data.data.type);
  const handleContactClick = () => {
    if (!isContact) {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_USER,
        user: {
          name: data.name,
          about: data.about,
          profilePicture: data.profilePicture,
          email: data.email,
          id: userInfo.id === data.senderId ? data.recieverid : data.senderId,
        },
      });
    } else {
      // if(currentChat?.id===data?.data.id){
      dispatch({ type: reducerCases.CHANGE_CURRENT_USER, user: { ...data } });
      dispatch({ type: reducerCases.SET_ALL_CONTACTS });
      // }
    }
  };
  return (
    <div
      className={`flex items-center cursor-pointer hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-4 pt-4 pb-2">
        {/* Avatar */}
        <Avatar type="lg" image={data?.data.profilePicture} />
      </div>
      <div className="flex flex-col w-full justify-center mt-2 pr-2 min-h-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white">{data?.data.name}</span>
          </div>
          {isContact && (
            <div>
              <span
                className={`${
                  data.data.totalUnreadMessages > 0
                    ? "text-icon-green"
                    : "text-gray-200"
                } text-sm`}
              >
                {calculateTime(data.data.createdAt) === "Invalid Date"
                  ? ""
                  : calculateTime(data.data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex py-2 border-b border-conversation-border">
          <div className="flex w-full justify-between">
            <div className="flex items-center text-slate-300 line-clamp-1 text-sm">
              {/* Message status and message in the same line */}
              {data.data.senderId === userInfo.id && (
                <MessageStatus MessageStatus={data.data.messageStatus} />
              )}
              {data.data.type === "text" && (
                <span className="truncate ml-2">{data.data.message}</span>
              )}
              {data.data.type === "audio" && (
                <span className="flex gap-1 items-center">
                  <FaMicrophone className="text-panel-header-icon" />
                  Audio
                </span>
              )}
              {data.data.type === "image" && (
                <span className="flex gap-1 items-center">
                  <FaCamera className="text-panel-header-icon" />
                  Image
                </span>
              )}
            </div>
            {data.data.totalUnreadMessages > 0 && (
              <span className="bg-icon-green text-sm rounded-full px-2">
                {data.data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
