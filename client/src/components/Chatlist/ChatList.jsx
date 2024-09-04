import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{ contacts }] = useStateProvider();
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contacts) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contacts]);
  return (
    <div className="flex flex-col max-h-screen z-[100] bg-panel-header-background">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}
    </div>
  );
}

export default ChatList;
