import { useState } from "react";
import DarkLogo from "../../assets/logo/DarkLogo";
import { Link } from "react-scroll";
import Logo from "../../assets/logo/Logo";
import resume from "../../assets/KhaledAhmedNayeem.pdf";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation links with labels and target sections Id.
  const navLinks = [
    { label: "Home", to: "hero" },
    { label: "About Me", to: "about" },
    { label: "Service", to: "service" },
    { label: "Projects", to: "projects" },
    { label: "Testimonials", to: "testimonials" },
    { label: "Contact", to: "contact" },
  ];

  return (
    <nav className="bg-white dark:bg-[#1E1E1E] flex justify-between items-center pt-6 max-w-7xl mx-auto px-4  sticky top-0 right-0 left-0 z-50">
      {/* Logo Section */}
      <div className="cursor-pointer">
        <Link to="hero" spy={true} smooth={true} offset={-100} duration={500}>
          <Logo className="h-20 w-40 dark:hidden" />
          <DarkLogo className="h-20 w-40 hidden dark:block" />
        </Link>
      </div>

      {/* Hamburger Icon for Small Screens */}
      <div className="lg:hidden flex items-center">
        <button
          className="text-black dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu.
        >
          {isMenuOpen ? (
            // Close Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Menu Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navbar Links */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:flex lg:items-center absolute lg:relative top-full left-0 w-full bg-white dark:bg-[#1E1E1E] lg:bg-transparent shadow-md lg:shadow-none z-10`}
      >
        <ul className="flex lg:flex-row flex-col lg:items-center items-center justify-end gap-3 lg:gap-8 py-4 lg:py-0 w-full">
          {/* Map nav links */}
          {navLinks.map((link, index) => (
            <li key={index} className="mx-3 text-black dark:text-white">
              <Link
                to={link.to}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="relative group cursor-pointer"
                activeClass="font-semibold text-[#FD6F00] underline underline-offset-2 decoration-[1.5px]"
              >
                {link.label}
                {/* Hover effect */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FD6F00] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          <li>
            <a
              href={resume}
              download="KhaledAhmedNayeem-Resume" // Set the name of the downloaded file
              className="bg-[#FD6F00] text-white py-[16px] px-[18px] text-[16px] font-normal rounded-md"
            >
              Download CV
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
