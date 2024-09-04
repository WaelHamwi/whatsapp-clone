import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomeVideoCall() {
  const [{ incomeVideoCall, socketRef }, dispatch] = useStateProvider();
  console.log(incomeVideoCall);
  const answerCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: { ...incomeVideoCall, type: "income" },
    });
    socketRef.current.emit("answer-income-call", { id: incomeVideoCall.id });
    dispatch({
      type: reducerCases.SET_INCOME_VIDEO_CALL,
      incomeVideoCall: undefined,
    });
  };
  const rejectCall = () => {
    socketRef.current.emit("rejected-video-call", { from: incomeVideoCall.id });
    dispatch({ type: reducerCases.END_CALL });
 
  };
  return (
    <div className="fixed flex gap-5 items-center justify-start bottom-6 mb-0 right-5 z-50 rounded-md h-30 w-80 p-3 bg-conversation-panel-background text-white drop-shadow-2xl border-2 py-14  border-icon-green">
      <div>
        <Image
          src={incomeVideoCall.profileImage.profileImage}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomeVideoCall.name}</div>
        <div className="text-xs">Income Video Call...</div>
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

export default IncomeVideoCall;
