import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_INIT_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios(`${GET_INIT_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
        dispatch({
          type: reducerCases.SET_CONTACT_USERS,
          userContacts: users,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, [userInfo]);
  return (
    <div className="flex-auto max-h-full overflow-auto custom-scrollbar bg-search-input-container-background">
      {filteredContacts && filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      ) : userContacts && userContacts.length > 0 ? (
        userContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      ) : (
        <p>No user contacts available.</p>
      )}
    </div>
  );
}

export default List;
