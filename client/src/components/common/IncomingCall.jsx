import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomeVoiceCall() {
  const [{ incomeVoiceCall, socketRef }, dispatch] = useStateProvider();
  console.log(incomeVoiceCall.id);
  const answerCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: { ...incomeVoiceCall, type: "income" },
    });
    socketRef.current.emit("answer-income-call", { id: incomeVoiceCall.id });
    dispatch({
      type: reducerCases.SET_INCOME_VOICE_CALL,
      incomeVoiceCall: undefined,
    });
  };
  const rejectCall = () => {
    socketRef.current.emit("rejected-voice-call", { from: incomeVoiceCall.id });
    dispatch({ type: reducerCases.END_CALL });
  };
  return (
    <div className="fixed flex gap-5 items-center justify-start bottom-6 mb-0 right-5 z-50 rounded-md h-30 w-80 p-3 bg-conversation-panel-background text-white drop-shadow-2xl border-2 py-14  border-icon-green">
      <div>
        <Image
          src={incomeVoiceCall.profileImage.profileImage}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomeVoiceCall.name}</div>
        <div className="text-xs">Income voice Call...</div>
        <div className="flex gap-4 mt-2">
          <button
            className="bg-red-700 p-3 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className="bg-green-700 p-3 text-sm rounded-full"
            onClick={answerCall}
          >
            Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomeVoiceCall;
