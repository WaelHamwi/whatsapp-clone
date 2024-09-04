import React from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

function PhotoLibrary({ setImage, hidePhotoLibrary }) {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-gray-700 rounded-lg p-5 max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div
          onClick={() => hidePhotoLibrary(false)}
          className="absolute top-2 right-2 cursor-pointer"
        >
          <IoClose className="h-8 w-8 text-white" />
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-4 p-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-lg"
              onClick={() => {
                setImage(image);
                hidePhotoLibrary(false);
              }}
            >
              <div className="h-20 w-20 cursor-pointer relative">
                <Image
                  src={image}
                  alt={`Avatar ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
