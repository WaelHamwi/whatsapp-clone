import React, { useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

function CapturePhoto({ hide, setImage }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context && videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setImage(canvas.toDataURL("image/jpeg"));
      hide(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center absolute h-4/5 w-1/3 top-1/4 left-1/4 bg-gray-600 gap-3 rounded-lg pt-3">
      <div className="flex flex-col justify-center gap-4 w-full  ">
        <div
          onClick={() => hide(false)}
          className="pt-2 pr-2 cursor-pointer flex items-center  justify-center"
        >
          <IoClose className="h-8 w-8 text-white " />
        </div>
        <div className="flex justify-center">
          <video id="video" width={500} autoPlay ref={videoRef}></video>
        </div>
      </div>
      <button
        className="border-4 mt-5 border-teal-300 p-5 mb-20 h-14 w-14 bg-white rounded-full cursor-pointer"
        onClick={capturePhoto}
      >

      </button>
    </div>
  );
}

export default CapturePhoto;
