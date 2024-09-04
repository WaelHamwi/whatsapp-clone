import React from "react";

function Input({ name, state, setState, label = false }) {
  return (
    <div className="flex gap-2 flex-col">
      {label && (
        <label htmlFor={name} className="text-teal-300 text-lg px-1">
          {label}
        </label>
      )}
      <input
        type="text"
        name={name}
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="px-4 w-full text-white h-12 py-3 border focus:outline-none rounded bg-input-background"
      />
    </div>
  );
}

export default Input;
