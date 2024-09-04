import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import WaveSurfer from "wavesurfer.js";

function VoiceMessage({ message }) {
  const [{ userInfo, currentChat }] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveRef = useRef(null);
  const waveForm = useRef(null);

  useEffect(() => {
    if (waveRef.current && !waveForm.current) {
      waveForm.current = WaveSurfer.create({
        container: waveRef.current,
        waveColor: "#ccc",
        progressColor: "#c9c9c9",
        cursorColor: "#e9e9e9",
        barWidth: 4,
        height: 30,
        responsive: true,
        minimap: true,
        minPxPerSec: 100,
        scrollParent: true,
        interact: true,
        backend: 'WebAudio',
        normalize: true,
        pixelRatio: 1,
        hideScrollbar: true,
        normalize: false,  
        partialRender: true,        
        barMinHeight: 1,           
        autoCenter: true 
      });

      waveForm.current.on("finish", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (waveForm.current) {
        waveForm.current.destroy();
        waveForm.current = null;
      }
    };
  }, [waveRef]);

  useEffect(() => {
    const audioUrl = `${HOST}/${message.message}`;
    setAudioMessage(new Audio(audioUrl));

    if (waveForm.current) {
      waveForm.current.load(audioUrl);
      waveForm.current.on("ready", () => {
        setTotalDuration(waveForm.current.getDuration());
      });
    }
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlayTime = () => {
        setCurrentPlayTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlayTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlayTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (waveForm.current) {
      waveForm.current.stop();
    }
    if (audioMessage) {
      audioMessage.pause();
    }
    setIsPlaying(false);
  };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-4 pr-3 text-sm rounded-lg text-white ${
        message.senderId === currentChat.data.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div>
        <Avatar type="lg" image={currentChat?.data.profilePicture} />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveRef}></div>
        <div className="flex justify-between absolute w-full bottom-[22px] pt-1 text-bubble-meta text-[10px]">
          <span>
            {formatTime(isPlaying ? currentPlayTime : totalDuration)}
          </span>
          <div className="flex gap-2">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && (
              <MessageStatus MessageStatus={message.MessageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
