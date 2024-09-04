import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();
  return (
    <div className="flex items-center gap-4 h-14 bg-search-input-container-background pl-4 py-4">
      <div className="flex-grow bg-panel-header-background gap-5 px-5 py-[6px] rounded-lg flex items-center">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon text-xl cursor-pointer" />
        </div>
        <input
          type="text"
          className="w-full text-white focus:outline-none bg-transparent text-sm"
          placeholder="search for contacts"
          value={contactSearch}
          onChange={(e) =>
            dispatch({
              type: reducerCases.SET_CONTACT_SEARCH,
              contactSearch: e.target.value,
            })
          }
        />
      </div>
      <div className="pr-4 pl-4">
        <BsFilter className="text-panel-header-icon text-xl cursor-pointer" />
      </div>
    </div>
  );
}

export default SearchBar;
