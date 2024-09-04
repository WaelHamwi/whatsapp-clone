import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu"; // Ensure this path is correct
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [grapPhoto, setGrapPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenu = (e) => {
    e.preventDefault(); // Prevent default context menu from appearing
    setContextMenuCoordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  useEffect(() => {
    if (grapPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrapPhoto(false);
        }, 1000);
      };
    }
  }, [grapPhoto]);
  // Example options for the context menu
  const contextMenuOptions = [
    {
      label: "Take a new photo",
      callback: () => setShowCapturePhoto(true),
    },
    {
      label: "Select from library",
      callback: () => setShowPhotoLibrary(true),
    },
    { label: "Upload new photo", callback: () => setGrapPhoto(true) },
  ];

  const photoPickerChange = async (e) => {
    console.log("sensor");
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  };
  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div
            className="relative h-10 w-10 cursor-pointer"
            onClick={showContextMenu}
          >
            <Image
              src={image || "/default_avatar.png"}
              alt="defaultImage"
              className="rounded-full"
              fill
            />
          </div>
        )}
        {type === "lg" && (
          <div
            className="relative h-[60px] w-[60px] cursor-pointer"
            onClick={showContextMenu}
          >
            <Image   src={image || "/default_avatar.png"} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={showContextMenu} // Left-click to show context menu
            onContextMenu={(e) => {
              e.preventDefault(); // Prevent default context menu from appearing
              showContextMenu(e);
            }}
          >
            {/* Overlay with camera icon and text */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-photopicker-overlay-background rounded-full ${
                hover ? "visible z-10" : "invisible z-0"
              }`}
              id="context-opener"
            >
              <div className="flex items-center gap-2">
                <FaCamera className="text-2xl" id="context-opener" />
                <span id="context-opener">Change photo</span>
              </div>
            </div>
            {/* Avatar Image */}
            <div className="flex items-center justify-center h-[120px] w-[120px]">
              <Image   src={image || "/default_avatar.png"} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {grapPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
}

export default Avatar;
