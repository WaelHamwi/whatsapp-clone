import React from "react";
import ReactDOM from "react-dom";

function PhotoPicker({ onChange }) {
  const component = (
    <input type="file" hidden id="photo-picker" onChange={onChange} />
  );

  const targetElement = document.getElementById("photo-picker-element");

  if (!targetElement) {
    console.error("Target container is not a DOM element.");
    return null; // or handle the error in some other way
  }

  return ReactDOM.createPortal(component, targetElement);
}

export default PhotoPicker;
