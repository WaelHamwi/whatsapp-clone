import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomeVideoCall from "./common/IncomingVideoCall";
import IncomeVoiceCall from "./common/IncomingCall";

function Main() {
  const router = useRouter();
  const [
    {
      userInfo,
      currentChat,
      messagesSearch,
      videoCall,
      incomeVideoCall,
      voiceCall,
      incomeVoiceCall,
    },
    dispatch,
  ] = useStateProvider();

  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin, router]);

  // From Firebase - Whenever the page is being refreshed, so the user info still we keep it
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (currentUser) => {
      try {
        console.log("Auth state changed", currentUser); // Check if this is logged

        if (!currentUser) {
          setRedirectLogin(true);
        }

        if (!userInfo && currentUser?.email) {
          const { data } = await axios.post(CHECK_USER_ROUTE, {
            email: currentUser.email,
          });

          if (!data.status) {
            router.push("/login");
          }

          console.log({ data }); // This should print the response data
          if (data?.data) {
            const {
              id,
              name,
              email,
              profilePicture: profileImage,
              status,
            } = data.data;

            dispatch({
              type: reducerCases.SET_USER_INFO,
              userInfo: {
                id,
                email,
                name,
                profileImage,
                status,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    });
  }, [userInfo, dispatch, router]);
  console.log(userInfo);
  useEffect(() => {
    if (userInfo && !socketRef.current) {
      socketRef.current = io(HOST);
      socketRef.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socketRef });
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (socketRef.current && !socketEvent) {
      socketRef.current.on(
        "income-video-call",
        ({ from, roomId, calltype, profileImage }) => {
          console.log("Incoming video call:", {
            from,
            roomId,
            calltype,
            profileImage,
          });
          dispatch({
            type: reducerCases.SET_INCOME_VIDEO_CALL,
            incomeVideoCall: {
              ...from,
              roomId,
              calltype,
              from,
            },
          });
        }
      );

      socketRef.current.on("msg-receive", (data) => {
        console.log("Message received:", data);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });
      socketRef.current.on(
        "income-voice-call",
        ({ from, roomId, calltype }) => {
          console.log("Incoming voice call:", { from, roomId, calltype });

          // Dispatching the action to set the incoming voice call state to true
          dispatch({
            type: reducerCases.SET_INCOME_VOICE_CALL,
            incomeVoiceCall: { ...from, roomId, calltype, active: true }, // Adding an 'active' property
          });
        }
      );

      socketRef.current.on("video-call-rejected", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socketRef.current.on("voice-call-rejected", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });
      socketRef.current.on("online-users", ({ onlineUsers }) => {
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      });
      setSocketEvent(true);
    }
  }, [socketRef.current, dispatch, socketEvent, incomeVideoCall]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const {
          data: { messages },
        } = await axios.get(
          `${GET_MESSAGE_ROUTE}/${userInfo?.id}/${currentChat?.data.id}`
        );
        dispatch({ type: reducerCases.SET_MESSAGES, messages });
        console.log(messages); // Ensure messages are logged correctly
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (userInfo && currentChat) {
      getMessages();
    }
  }, [userInfo, currentChat, dispatch]);

  useEffect(() => {
    console.log("incomeVideoCall updated:", incomeVideoCall);
  }, [incomeVideoCall]);

  console.log(incomeVideoCall);

  return (
    <>
      {incomeVideoCall && <IncomeVideoCall />}
      {incomeVoiceCall && <IncomeVoiceCall />}
      {videoCall && (
        <div className="max-h-full overflow-hidden h-screen w-screen">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="max-h-full overflow-hidden h-screen w-screen">
          <VoiceCall />
        </div>
      )}
      {!voiceCall && !videoCall && (
        <div className="grid grid-cols-main h-screen w-screen max-w-full max-h-screen overflow-hidden">
          <ChatList />
          {currentChat ? (
            <div
              className={`grid ${
                messagesSearch ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
