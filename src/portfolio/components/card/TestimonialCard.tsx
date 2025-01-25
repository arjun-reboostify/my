type TestimonialCardProps = {
  image: string;
  text: string;
  authorName: string;
  authorTitle: string;
};

const TestimonialCard = ({
  image,
  text,
  authorName,
  authorTitle,
}: TestimonialCardProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-[#F8F8F8] w-[280px] sm:w-[330px] md:w-[600px] lg:w-[800px] h-auto mx-auto py-6 px-4 sm:px-6 rounded-lg shadow-md cursor-pointer">
      {/* Image Container: Adjusted for responsive sizes */}
      <div className="w-full md:w-[30%] h-auto flex-shrink-0 mb-4 sm:mb-0">
        <img
          src={image}
          alt={`${authorName}'s profile`}
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-auto rounded-full mx-auto sm:p-2 md:p-5"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col text-center sm:text-left flex-grow">
        <p className="text-gray-600 text-sm sm:text-base">
          <span className="text-[#FD6F00] text-2xl font-bold">“</span> {text}
          <span className="text-[#FD6F00] text-2xl font-bold">”</span>
        </p>
        <h3 className="text-base sm:text-lg font-bold mt-2">{authorName}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{authorTitle}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
