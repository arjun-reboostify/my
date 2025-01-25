import SectionHeader from "../SectionHeader";

const ContactMe = () => {
  return (
    <div id="contact" className="flex flex-col items-center px-4 py-8">
      <SectionHeader
        title="Let's Design Together"
        subHeader="Lorem ipsum dolor sit amet consectetur. Tristique amet sed massa nibh lectus netus in. Aliquet donec morbi convallis pretium"
      />
      <div className="flex flex-col sm:flex-row sm:gap-6 w-full max-w-[800px] mt-6">
        <input
          type="email"
          className="py-[14px] pl-6 border border-[#AFAFAF] rounded-lg text-xl font-normal w-full bg-[#F8F8F8] focus:outline-none focus:ring-2 focus:ring-[#FD6F00] sm:mb-0 mb-4"
          placeholder="Enter Your Email"
        />
        <button className="bg-[#FD6F00] text-white rounded-lg py-4 px-8 font-semibold w-full sm:w-[40%]">
          Contact Me
        </button>
      </div>
    </div>
  );
};

export default ContactMe;
