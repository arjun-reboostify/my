import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";
import AboutMe from "./components/ui/AboutMe";
import ContactMe from "./components/ui/ContactMe";
import Hero from "./components/ui/Hero";
import MyProjects from "./components/ui/MyProjects";
import Services from "./components/ui/Services";
import Testimonials from "./components/ui/Testimonials";

function App() {
  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      {/* <Navbar />
      <Hero /> */}
      <AboutMe />
      {/* <Services />
      <MyProjects />
      <Testimonials />
      <ContactMe />
      <Footer /> */}
    </div>
  );
}

export default App;
