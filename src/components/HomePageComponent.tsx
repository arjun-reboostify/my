import Navbar from "./Navbar";
import AddNote from "./Notes/AddNote";
import Notes from "../components/Notes";
import { SearchProvider } from "../context/SearchContext";
import { LayoutProvider } from "../context/LayoutContext";
import Side from './it/Sidebar'
const HomePageComponent = () => (
  // Root div with min-height to ensure full coverage
 <><Side /><div className="min-h-screen bg-black">
    <LayoutProvider>
      <SearchProvider>
        {/* Main container with padding-top to account for fixed navbar */}
        <div className="min-h-screen bg-black">
          {/* Max width container with auto margins */}
          <div className="max-w-7xl mx-auto px-2 pt-16 bg-black">
            <Navbar />
            <AddNote />
            <Notes />
          </div>
        </div>
      </SearchProvider>
    </LayoutProvider>
  </div></>
);

export default HomePageComponent;