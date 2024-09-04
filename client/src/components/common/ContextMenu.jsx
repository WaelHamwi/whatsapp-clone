import React, { useRef, useEffect } from "react";

function ContextMenu({ options, coordinates, contextMenu, setContextMenu }) {
  console.log(options);
  const contextMenuRef = useRef(null);

  const handleClick = (e, callback) => {
    e.preventDefault();
    callback();
    setContextMenu(false);
    e.stopPropagation();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target)
        ) {
          setContextMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setContextMenu]);

  return (
    <div
      className="shadow-xl z-[999] bg-dropdown-background fixed py-2"
      style={{ top: `${coordinates.y}px`, left: `${coordinates.x}px` }}
      ref={contextMenuRef}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e) => handleClick(e, callback)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-700"
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
