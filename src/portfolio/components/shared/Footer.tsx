import FacebookIcon from "../../assets/icons/FacebookIcon";
import FacebookIconDark from "../../assets/icons/FacebookIconDark";
import InstagramIcon from "../../assets/icons/InstagramIcon";
import InstagramIconDark from "../../assets/icons/InstagramIconDark";
import LinkedInIcon from "../../assets/icons/LinkedInIcon";
import LinkedInIconDark from "../../assets/icons/LinkedInIconDark";
import TwitterIcon from "../../assets/icons/TwitterIcon";
import TwitterIconDark from "../../assets/icons/TwitterIconDark";
import DarkLogo from "../../assets/logo/DarkLogo";
import Logo from "../../assets/logo/Logo";

const Footer = () => {
  const navLinks = [
    { label: "Home" },
    { label: "About Me" },
    { label: "Service" },
    { label: "Projects" },
    { label: "Testimonials" },
    { label: "Contact" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-[#1E1E1E] space-y-10">
      {/* Logo */}
      <div className="flex justify-center pt-[50px]">
        <Logo className="dark:hidden" />
        <DarkLogo className="hidden dark:block" />
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-wrap gap-3 justify-center md:gap-6 lg:gap-8">
        {navLinks.map((link, index) => (
          <li
            key={index}
            className="text-black dark:text-white mx-3 my-2 text-center"
          >
            {link.label}
          </li>
        ))}
      </ul>

      {/* Social Media Icons */}
      <div className="flex gap-6 justify-center mt-4">
        {/* Light Mode Icons */}
        <FacebookIcon className="h-8 w-8 dark:hidden" />
        <TwitterIcon className="h-8 w-8 dark:hidden" />
        <InstagramIcon className="h-8 w-8 dark:hidden" />
        <LinkedInIcon className="h-8 w-8 dark:hidden" />
        {/* Dark Mode Icons */}
        <FacebookIconDark className="h-8 w-8 hidden dark:block" />
        <TwitterIconDark className="h-8 w-8 hidden dark:block" />
        <InstagramIconDark className="h-8 w-8 hidden dark:block" />
        <LinkedInIconDark className="h-8 w-8 hidden dark:block" />
      </div>

      {/* Footer Text */}
      <div className="bg-[#545454] dark:bg-[#121212] text-white py-6">
        <h4 className="font-normal text-[20px] text-center">
          © 2023 <span className="text-[#FD6F00] font-bold">Mumair</span> All
          Rights Reserved, Inc.
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
