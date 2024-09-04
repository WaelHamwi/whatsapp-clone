import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchContact, setSearchContact] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();

  useEffect(() => {
    if (searchContact.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((object) =>
          object.name.toLowerCase().includes(searchContact.toLowerCase())
        );
      });
      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchContact, allContacts]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        setSearchContacts(users);
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);
  return (
    <div className="flex flex-col h-full">
      {/* Check if there are no contacts available */}
      {Object.keys(searchContacts).length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 ">
          No contacts available for this search.
        </div>
      ) : (
        <>
          <div className="flex items-end px-4 py-4 h-[65px]">
            <div className="flex items-center gap-10 text-white">
              <BiArrowBack
                className="cursor-pointer text-xl"
                onClick={() =>
                  dispatch({ type: reducerCases.SET_ALL_CONTACTS })
                }
              />
              <span>New Conversation</span>
            </div>
          </div>
          <div className="flex-auto h-full overflow-auto custom-scrollbar bg-search-input-container-background">
            <div className="flex py-4 gap-3 h-12 items-center">
              <div className="flex-grow bg-panel-header-background gap-5 px-5 mx-5 py-[6px] rounded-lg flex items-center">
                <div>
                  <BiSearchAlt2 className="text-panel-header-icon text-xl cursor-pointer" />
                </div>
                <input
                  type="text"
                  className="w-full text-white focus:outline-none bg-transparent text-sm"
                  placeholder="Search contacts"
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                />
              </div>
            </div>
            {Object.entries(searchContacts).map(([initLetter, userList]) => (
              <div key={initLetter}>
                {userList.length > 0 && (
                  <div className="text-teal-200 pl-8 py-8">{initLetter}</div>
                )}
                {userList.map((contact) => (
                  <ChatLIstItem
                    key={contact.id}
                    data={contact}
                    isContact={true}
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ContactsList;
