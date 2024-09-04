import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const Container = dynamic(() => import("./Container"), { ssr: false });
function VoiceCall() {
  const [{ voiceCall, socketRef, userInfo }] = useStateProvider();
  useEffect(() => {
    if (voiceCall.type === "out-going") {
      socketRef.current.emit("outgoing-voice-call", {
        //register this event in the server
        to: voiceCall.data.id,
        from: {
          id: userInfo.id,
          profileImage: userInfo,
          name: userInfo.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall, socketRef, userInfo]);
  return <Container data={voiceCall} />;
}

export default VoiceCall;
