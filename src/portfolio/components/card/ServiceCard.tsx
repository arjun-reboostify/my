type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const ServiceCard = ({ title, description, icon: Icon }: ServiceCardProps) => {
  return (
    <div className="bg-[#F8F8F8] rounded-[14px] p-6 mx-[10%] sm:mx-0 sm:p-8 flex flex-col h-full">
      {/* Dynamic Icon */}
      <div className="flex justify-center sm:justify-start items-center mb-4">
        <Icon />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center sm:items-start gap-2 mt-6">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
