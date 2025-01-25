import FacebookIcon from "../../assets/icons/FacebookIcon";
import InstagramIcon from "../../assets/icons/InstagramIcon";
import LinkedInIcon from "../../assets/icons/LinkedInIcon";
import TwitterIcon from "../../assets/icons/TwitterIcon";
import heroImage from "../../assets/images/hero-image.png";
import LinkedInIconDark from "../../assets/icons/LinkedInIconDark";
import FacebookIconDark from "../../assets/icons/FacebookIconDark";
import TwitterIconDark from "../../assets/icons/TwitterIconDark";
import InstagramIconDark from "../../assets/icons/InstagramIconDark";

const Hero = () => {
  return (
    <div id="hero" className="bg-white dark:bg-[#1E1E1E] max-w-7xl mx-auto flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-36 h-auto px-4 py-8">
      {/* Left Side: Profile Info */}
      <div className="w-full lg:w-[60%] text-center lg:text-left">
        <h1 className="text-black dark:text-white text-2xl font-semibold">
          Hi I am
        </h1>
        <h2 className="text-3xl lg:text-4xl font-semibold text-[#FD6F00] mt-4">
          Muhammad Umair
        </h2>
        <div>
          <p className="text-5xl lg:text-8xl text-black dark:text-white font-bold mt-2">
            UI & UX
          </p>
          <p className="text-5xl lg:text-8xl text-black dark:text-white font-bold mt-2 pl-12 lg:pl-[10%]">
            Designer
          </p>
        </div>
        <p className="mt-6 text-black dark:text-white text-lg lg:text-xl">
          Lorem ipsum dolor sit amet consectetur. Tristique amet sed massa nibh
          lectus netus in. Aliquet donec morbi convallis pretium. Turpis tempus
          pharetra
        </p>
        <button className="mt-6 bg-[#FD6F00] text-white py-[12px] px-[54px] text-[22px] font-normal rounded-md">
          Hire Me
        </button>
      </div>

      {/* Right Side: Profile Image */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center lg:items-start gap-9">
        {/* Profile Image */}
        <div className="relative w-full max-w-[370px]">
          <img
            src={heroImage}
            alt="Profile"
            className="w-full h-full object-cover rounded-lg"
          />

          <div className="absolute bg-[#FD6F0099] p-3 top-12 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[70%] h-[60px] sm:h-[70px]"></div>

          {/* Social Media Icons */}
          <div className="absolute bottom-[-65px] left-1/2 transform -translate-x-1/2 flex gap-6 pb-4">
            {/* Light Mode Icon */}
            <FacebookIcon className="h-8 w-8 dark:hidden" />
            <TwitterIcon className="h-8 w-8 dark:hidden" />
            <InstagramIcon className="h-8 w-8 dark:hidden" />
            <LinkedInIcon className="h-8 w-8 dark:hidden" />
            {/* Dark Mode Icon */}
            <FacebookIconDark className="h-8 w-8 hidden dark:block" />
            <TwitterIconDark className="h-8 w-8 hidden dark:block" />
            <InstagramIconDark className="h-8 w-8 hidden dark:block" />
            <LinkedInIconDark className="h-8 w-8 hidden dark:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
