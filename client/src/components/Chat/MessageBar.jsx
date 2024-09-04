import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";

const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {
  const [{ userInfo, currentChat, socketRef }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const EmojiPickerRef = useRef(null);
  const [grapPhoto, setGrapPhoto] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState(false);

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChat.data.id,
        },
      });
      if (response.status === 201) {
        socketRef.current.emit("send-msg", {
          to: currentChat?.data.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleOutsidePicker = (event) => {
      if (
        event.target.id !== "emoji" &&
        EmojiPickerRef.current &&
        !EmojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsidePicker);
    return () => {
      document.removeEventListener("click", handleOutsidePicker);
    };
  }, []);

  const handleEmoji = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = async (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChat?.data.id,
        from: userInfo?.id,
        message,
      });
      socketRef.current.emit("send-msg", {
        to: currentChat?.data.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (grapPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrapPhoto(false);
        }, 1000);
      };
    }
  }, [grapPhoto]);

  return (
    <div id="chat-convers" className="relative flex items-center px-4 gap-5 pt-4 pb-5 bg-panel-header-background sm:h-40 sm:flex-col  md:h-20 md:flex-row">
      {!audioRecorder && (
        <>
          <div className="flex gap-5">
            <BsEmojiSmile
              className="cursor-pointer text-xl text-panel-header-icon"
              title="emoji"
              id="emoji"
              onClick={handleEmoji}
            />
            {emojiPicker && (
              <div
                className="absolute z-[1000] bottom-20 left-2"
                ref={EmojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="cursor-pointer text-xl text-panel-header-icon"
              title="attachment"
              onClick={() => setGrapPhoto(true)}
            />
          </div>
          <div  className="flex items-center sm:ml-2  h-12 w-full rounded-lg sm:justify-center md:justify-end">
            <input
              type="text"
              placeholder="type a message"
              className="bg-input-background text-sm h-10 px-4  w-52 py-4 rounded-lg text-white focus:outline-none"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="flex items-center justify-center w-10">
            <button>
              {message.length ? (
                <MdSend
                  className="cursor-pointer text-xl text-panel-header-icon"
                  title="send a message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone
                  className="cursor-pointer text-xl text-panel-header-icon"
                  title="record"
                  onClick={() => setAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      {grapPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {audioRecorder && <CaptureAudio onChange={setAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
