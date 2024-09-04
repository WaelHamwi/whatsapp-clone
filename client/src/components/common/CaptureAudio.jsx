import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import axios from "axios"; // Ensure axios is imported
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

function CaptureAudio({ onChange }) {
  const [{ userInfo, currentChat, socketRef }, dispatch] = useStateProvider();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null); // Add this state
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorder = useRef(null);
  const waveRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Clear interval when recording stops
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlayTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudioURL(null);
    setRecordedAudioBlob(null); // Reset blob
    chunks.current = []; // Reset chunks
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorderInstance = new MediaRecorder(stream);
        mediaRecorder.current = mediaRecorderInstance;
        audioRef.current.srcObject = stream;

        mediaRecorderInstance.ondataavailable = (e) =>
          chunks.current.push(e.data);
        mediaRecorderInstance.onstop = () => {
          const blob = new Blob(chunks.current, {
            type: "audio/ogg; codecs=opus",
          });
          const audioURL = URL.createObjectURL(blob);
          setRecordedAudioURL(audioURL);
          setRecordedAudioBlob(blob); // Set the blob here
          if (waveForm) waveForm.load(audioURL);
        };
        mediaRecorderInstance.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (waveForm) waveForm.stop();
    }
  };

  useEffect(() => {
    if (recordedAudioURL) {
      const audio = new Audio(recordedAudioURL);
      const updatePlayTime = () => {
        setCurrentPlayTime(audio.currentTime);
      };
      audio.addEventListener("timeupdate", updatePlayTime);
      return () => {
        audio.removeEventListener("timeupdate", updatePlayTime);
      };
    }
  }, [recordedAudioURL]);

  const handlePlayRecord = () => {
    if (recordedAudioURL) {
      const audio = new Audio(recordedAudioURL);
      if (waveForm) waveForm.play();
      audio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecord = () => {
    if (waveForm) waveForm.stop();
    if (recordedAudioURL) {
      const audio = new Audio(recordedAudioURL);
      audio.pause();
    }
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    if (!recordedAudioBlob) {
      console.error("No recorded audio found.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", recordedAudioBlob, "recording.ogg");

    try {
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
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

  const formatTime = (time) => {
    //  if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("wavesurfer.js").then((module) => {
        const WaveSurfer = module.default;
        const wavesurfer = WaveSurfer.create({
          container: waveRef.current,
          waveColor: "#ccc",
          progressColor: "#c9c9c9",
          cursorColor: "e9e9e9e",
          barWidth: 2,
          height: 30,
          responsive: true,
        });
        setWaveForm(wavesurfer);
        wavesurfer.on("finish", () => {
          setIsPlaying(false);
        });
      });
    }
    return () => {
      if (waveForm) {
        waveForm.destroy();
      }
    };
  }, []);

  return (
    <div className="flex items-center w-full text-2xl justify-end">
      <div className="pt-2">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => onChange()}
        />
      </div>
      <div className="flex justify-center items-center gap-2 mx-3 px-3 py-2 text-white text-lg bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-600 animate-pulse text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudioURL && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecord} />
                ) : (
                  <FaStop onClick={handlePauseRecord} />
                )}
              </>
            )}
          </div>
        )}
        <div
          className="flex items-center  justify-between  w-60 h-10"
          ref={waveRef}
        >
          {recordedAudioURL && isPlaying && (
            <span>{formatTime(currentPlayTime)}</span>
          )}
          {recordedAudioURL && !isPlaying && (
            <span>{formatTime(totalDuration)}</span>
          )}
          <audio ref={audioRef} hidden />
          <div className="mr-4">
            {!isRecording ? (
              <FaMicrophone
                className="text-red-600"
                onClick={handleStartRecording}
              />
            ) : (
              <FaPauseCircle
                className="text-red-600"
                onClick={handleStopRecording}
              />
            )}
          </div>
          <div>
            <MdSend
              className="text-panel-header-icon cursor-pointer mr-5"
              title="send"
              onClick={sendRecording}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
