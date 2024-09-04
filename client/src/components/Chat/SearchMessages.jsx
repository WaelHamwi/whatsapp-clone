import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const [{ currentChat, messages }, dispatch] = useStateProvider();
  const [searchMessage, setSearchMessage] = useState("");
  const [searchedMessage, setSearchedMessage] = useState([]);
  useEffect(() => {
    if (searchMessage) {
      setSearchedMessage(
        messages.filter(
          (message) =>
            message.type === "text" && message.message.includes(searchMessage)
        )
      );
    } else {
      setSearchedMessage([]);
    }
  }, [searchMessage]);

  return (
    <div className="flex flex-col z-10 max-h-screen border-conversation-border border-l w-full bg-conversation-panel-background">
      <div className="flex items-center  gap-10 h-16 md:h-[104px] p-4 bg-panel-header-background text-primary-strong">
        <IoClose
          className="text-2xl text-icon-lighter cursor-pointer"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
        />
        <span>Search a Message</span>
      </div>
      <div className="h-full overflow-auto custom-scrollbar">
        <div className="flex flex-col w-full items-center">
          <div className="flex items-center  w-full gap-4 h-14 px-10">
            <div className="flex-grow bg-panel-header-background gap-5 px-5 py-[6px] rounded-lg  flex items-center">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon  text-xl cursor-pointer" />
              </div>
              <input
                type="text"
                className="w-full  text-white  focus:outline-none bg-transparent text-sm"
                placeholder="search a message"
                value={searchMessage}
                onChange={(e) => setSearchMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
        <span className="text-gray-400  mt-10 mx-2 flex justify-center items-center">
          {!searchMessage.length &&
            `search for a message with ${currentChat.data.name}`}
        </span>
      </div>
      <div className="flex flex-col justify-center h-full">
        {searchMessage.length > 0 && !searchedMessage.length && (
          <span className="flex justify-center text-red-600">
            no message is found
          </span>
        )}
        <div className="flex flex-col w-full h-full">
          {searchedMessage.map((message) => (
            <div className="flex flex-col w-full px-5 py-5 border-b border-secondary cursor-pointer justify-center hover:bg-background-default-hover">
              <div className="text-sm text-gray-400">
                {calculateTime(message.createdAt)}
              </div>
              <div className="text-icon-green">{message.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
