type ProjectShowCardProps = {
  imageSrc: string;
  category: string;
  title: string;
};

const ProjectShowCard = ({
  imageSrc,
  category,
  title,
}: ProjectShowCardProps) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <div className="bg-[#FFEBDB] w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[450px] xl:h-[450px] rounded-[12px] overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={imageSrc}
          alt={title}
        />
      </div>
      <div className="mt-[35px]">
        <p className="text-[#FD6F00] text-lg font-normal mb-[10px] text-center sm:text-left">
          {category}
        </p>
        <h3 className="text-black dark:text-white text-xl sm:text-2xl font-bold text-center sm:text-left">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default ProjectShowCard;
