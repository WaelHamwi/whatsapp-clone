import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const Container = dynamic(() => import("./Container"), { ssr: false });
function VideoCall() {
  const [{ videoCall, socketRef, userInfo }] = useStateProvider();
  useEffect(() => {
    if (videoCall.type === "out-going") {
      socketRef.current.emit("outgoing-video-call", {
        //register this event in the server
        to: videoCall.data.id,
        from: {
          id: userInfo.id,
          profileImage: userInfo,
          name: userInfo.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall, socketRef, userInfo]);
  return <Container data={videoCall} />;
}

export default VideoCall;
