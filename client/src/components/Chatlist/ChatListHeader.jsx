import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";
function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const router = useRouter();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };
  const contextMenuOptions = [
    {
      name: "Logout",
      callback: async () => {
        router.push("/logout");
      },
    },
  ];

  const handleAllContacts = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS });
  };
  return (
    <div className="flex justify-between items-center h-16 px-5 py-4 ">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-5">
        <BsFillChatLeftTextFill
          className="cursor-pointer text-xl  text-panel-header-icon"
          title="chat text"
          onClick={handleAllContacts}
        />
        <BsThreeDotsVertical
          className="cursor-pointer text-xl  text-panel-header-icon"
          title="menu list"
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
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

export default ChatListHeader;
