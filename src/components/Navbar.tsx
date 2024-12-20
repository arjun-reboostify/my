import { FC, useContext, useRef } from "react";
import { BsViewList } from "react-icons/bs";
import { FcSearch } from "react-icons/fc";
import { AiOutlineLogout, AiOutlineClose } from "react-icons/ai";
import { FiGrid } from "react-icons/fi";
import { LayoutContext } from "../context/LayoutContext";
import { noterAuth } from "../firebase";
import IconButton from "./shared/IconButton";
import { SearchContext } from "../context/SearchContext";


const Navbar: FC = () => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const searchInput = useRef<HTMLInputElement>(null);
  return (
    <nav className="fixed bg-black z-40 top-0 left-0 h-16 w-full border-b-2 border-gray-700 border-opacity-25 grid grid-cols-12 gap-4 items-center px-4">
      <div className="col-span-2 sm:col-span-3 flex gap-2 items-center">
      
      <img
                src="/logo.png"
                                className="h-10 w-10"
              />
   
      </div>
      <div
        onClick={() => {
          console.log("click");
          searchInput.current?.focus();
        }}
        className=" transition-all duration-200 col-span-6 rounded-md max-w-2xl bg-black focus-within:bg-transparent focus-within:shadow flex items-center gap-2"
      >
        <IconButton>
          <FcSearch size={26} />
        </IconButton>
        <input
          ref={searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your thoughts"
          type="text"
          className="bg-gray-900 border-none outline-none border-2 rounded w-full flex-1 h-10"
        />
        <IconButton
          onClick={(e) => {
            console.log("clear button clicked");
            e.stopPropagation();
            setSearchTerm("");
          }}
        >
          <AiOutlineClose size={20} />
        </IconButton>
      </div>
      <div className="col-start-11 col-span-2 flex gap-0 md:gap-3 justify-end ">
        <LayoutToggleButton />
        
      
      </div>
    </nav>
  );
};

const LayoutToggleButton = () => {
  const { layout, toggleLayout } = useContext(LayoutContext);
  return (
    <IconButton onClick={() => toggleLayout()}>
      {layout !== "grid" ? <FiGrid size={26} /> : <BsViewList size={26} />}
    </IconButton>
  );
};

export default Navbar;
