import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import * as Zego from "zego-express-engine-webrtc";

function Container({ data }) {
  const [{ socketRef, userInfo }, dispatch] = useStateProvider();
  const [CallAnswered, setCallAnswered] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

  const name = data.data?.name || data.name;
  const image = data.data?.profilePicture || data.profileImage.profileImage;
  const isVideoCall = data.callType === "video";
  const isVoiceCall = data.callType === "voice";

  useEffect(() => {
    if (data.type === "out-going") {
      socketRef.current.on("answer-call", () => setCallAnswered(true));
    } else {
      setTimeout(() => {
        setCallAnswered(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const {
          data: { token: returnedToken },
        } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
        setToken(returnedToken);
        console.log("Token received:", returnedToken);
      } catch (error) {
        console.log("Error fetching token:", error);
      }
    };
    getToken();
  }, [CallAnswered]);

  useEffect(() => {
    const startCall = async () => {
      try {
        const zg = new Zego.ZegoExpressEngine(
          parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID, 10),
          process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
        );
        setZgVar(zg);
        console.log("ZegoExpressEngine initialized:", zg);

        zg.on("roomStreamUpdate", async (roomId, updateType, streamList) => {
          console.log("Room Stream Update:", roomId, updateType, streamList);

          if (updateType === "ADD" && streamList.length > 0) {
            const stream = streamList[0];
            const streamID = stream.streamID;
            const mediaElement = document.createElement(
              data.callType === "video" ? "video" : "audio"
            );
            mediaElement.id = streamID;
            mediaElement.autoplay = true;
            mediaElement.playsInline = true;

            const rmVideo = document.getElementById("remote-video");
            if (rmVideo) {
              rmVideo.appendChild(mediaElement);
            }

            try {
              const remoteStream = await zg.startPlayingStream(streamID, {
                audio: true,
                video: data.callType === "video",
              });
              console.log("Remote stream started:", remoteStream);

              mediaElement.srcObject = remoteStream;
              console.log(
                "Remote stream attached to media element:",
                mediaElement
              );

              const remoteTracks = remoteStream.getTracks();
              console.log("Remote stream tracks:", remoteTracks);

              if (remoteTracks.length > 0) {
                remoteTracks.forEach((track) => {
                  zg.getRTCStats(track)
                    .then((stats) => {
                      console.log("Stats for track:", track.id, stats);
                    })
                    .catch((error) => {
                      console.error(
                        "Error getting stats for track:",
                        track.id,
                        error
                      );
                    });
                });
              } else {
                console.error("No tracks found in remote stream.");
              }
            } catch (error) {
              console.error("Error starting to play stream:", error);
            }
          } else if (
            updateType === "DELETE" &&
            zg &&
            localStream &&
            streamList.length > 0
          ) {
            const streamID = streamList[0].streamID;
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch({ type: reducerCases.END_CALL });
            console.log("Stream deleted:", streamID);
          }
        });

        //  log in to the room
        console.log(" log in to the room with ID:", data.roomId);
        await zg.loginRoom(
          data.roomId.toString(),
          token,
          {
            userID: userInfo.id.toString(),
            userName: userInfo.name,
          },
          { userUpdate: true }
        );
        console.log("Successfully logged into the room with ID:", data.roomId);

        const localStream = await zg.createStream({
          camera: {
            audio: true,
            video: data.callType === "video",
          },
        });
        console.log("Local Stream created:", localStream);

        const localVideo = document.getElementById("local-audio");
        const videoElement = document.createElement(
          data.callType === "video" ? "video" : "audio"
        );
        videoElement.id = "video-local-zego";
        videoElement.className = "h-30 w-30";
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        localVideo.appendChild(videoElement);

        videoElement.srcObject = localStream;
        console.log("Local stream attached to video element:", videoElement);

        const streamID = "123" + Date.now();
        setPublishStream(streamID);
        setLocalStream(localStream);
        console.log("Stream ID set for publishing:", streamID);

        // Attempting to publish the stream
        console.log("Attempting to publish the stream with ID:", streamID);
        try {
          await zg.startPublishingStream(streamID, localStream);
          console.log("Stream published successfully with ID:", streamID);
        } catch (error) {
          console.error("Error starting to publish stream:", error);
        }
      } catch (error) {
        console.error(
          "Error initializing ZegoExpressEngine or during the call process:",
          error
        );
      }
    };

    if (token) {
      startCall();
    }
  }, [token]);

  const endCall = () => {
    const id = data.data?.id || data.id;
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
      console.log("Call ended, streams destroyed");
    }
    if (data.callType === "video") {
      socketRef.current.emit("rejected-video-call", {
        from: id,
      });

      dispatch({ type: reducerCases.END_CALL });
    } else {
      socketRef.current.emit("rejected-voice-call", {
        from: id,
      });
      dispatch({ type: reducerCases.END_CALL });
    }
  };

  console.log("Local Stream (outside useEffect):", localStream);
  console.log(
    "Local Stream Tracks (outside useEffect):",
    localStream?.getTracks()
  );

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] overflow-hidden border-conversation-border bg-conversation-panel-background border-l w-full text-slate-50">
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">{name}</span>
        <span className="text-lg">
          {CallAnswered && data.callType !== ""
            ? isVideoCall
              ? "Video calling..."
              : isVoiceCall
              ? "Voice calling..."
              : "Calling..."
            : isVideoCall
            ? "Start Video Call"
            : isVoiceCall
            ? "Start Voice Call"
            : "Call"}
        </span>
      </div>
      {(!CallAnswered || data.callType === "audio") && (
        <div className="my-14">
          <Image
            src={image}
            className="rounded-full"
            alt="avatar"
            height={300}
            width={300}
          />
        </div>
      )}
      <div className="relative my-4" id="remote-video">
        <div className="absolute bottom-4 right-4" id="local-audio"></div>
      </div>
      <div className="flex items-center justify-center rounded-full bg-red-800 h-15 w-15 py-3 px-3">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;
