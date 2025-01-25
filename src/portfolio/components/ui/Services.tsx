import AppDesignIcon from "../../assets/icons/AppDesignIcon";
import GraphicDesignIcon from "../../assets/icons/GraphicDesignIcon";
import UIUXIcon from "../../assets/icons/UIUXIcon";
import WebDEsignIncon from "../../assets/icons/WebDEsignIncon";
import ServiceCard from "../card/ServiceCard";
import SectionHeader from "../SectionHeader";

const servicesData = [
  {
    icon: UIUXIcon,
    title: "UI/UX",
    description:
      "Lorem ipsum dolor sit amet consectetur. Morbi diam nisi nam diam interdum",
  },
  {
    icon: WebDEsignIncon,
    title: "Web Design",
    description:
      "Lorem ipsum dolor sit amet consectetur. Morbi diam nisi nam diam interdum",
  },
  {
    icon: AppDesignIcon,
    title: "App Design",
    description:
      "Lorem ipsum dolor sit amet consectetur. Morbi diam nisi nam diam interdum",
  },
  {
    icon: GraphicDesignIcon,
    title: "Graphic Design",
    description:
      "Lorem ipsum dolor sit amet consectetur. Morbi diam nisi nam diam interdum",
  },
];

const Services = () => {
  return (
    <div id="service" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Services"
        subHeader="Lorem ipsum dolor sit amet consectetur. Tristique amet sed massa nibh lectus netus in. Aliquet donec morbi convallis pretium"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {servicesData.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
