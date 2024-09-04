import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
function ChatHeader() {
  const [{ currentChat, onlineUsers }, dispatch] = useStateProvider();
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };
  const contextMenuOptions = [
    {
      name: "Exit",
      callback: async () => {
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      },
    },
  ];

  const handleVoiceCall = () => {
    console.log("Starting voice call with chat:", currentChat); // Log currentChat

    const voiceCallData = {
      ...currentChat,
      type: "out-going",
      callType: "voice",
      roomId: Date.now(),
    };

    console.log("Reducer case SET_VOICE_CALL:", reducerCases.SET_VOICE_CALL); // Log reducer case
    console.log("Dispatching voice call data:", voiceCallData); // Log voiceCall object

    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: voiceCallData,
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChat,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };
  console.log(currentChat);
  return (
    <div className="flex justify-between items-center bg-panel-header-background h-16 px-3 py-3 z-10">
      <div className="flex items-center justify-center gap-4">
        <Avatar type="sm" image={currentChat?.data.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChat?.data.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChat.data.id) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-5">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={(e) => showContextMenu(e)}
          id="context-operator"
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
