import { useState } from "react";
import ProjectShowCard from "../card/ProjectShowCard";
import SectionHeader from "../SectionHeader";
import projectImage1 from "../../assets/images/project-1.png";
import projectImage2 from "../../assets/images/project-2.png";
import projectImage3 from "../../assets/images/project-3.png";

const categories = [
  "All",
  "UI/UX",
  "Web Design",
  "App Design",
  "Graphic Design",
];

const projects = [
  {
    imageSrc: projectImage1,
    category: "Web Design",
    title: "Business Landing Page Design",
  },
  {
    imageSrc: projectImage2,
    category: "App Development",
    title: "Mobile App Interface Design",
  },
  {
    imageSrc: projectImage3,
    category: "App Development",
    title: "Mobile App Interface Design",
  },
];

const MyProjects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter projects based on the selected category
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div id="projects" className="max-w-7xl mx-auto py-10 px-4">
      <SectionHeader
        title="My Projects"
        subHeader="Lorem ipsum dolor sit amet consectetur. Mollis erat duis aliquam mauris est risus lectus. Phasellus consequat urna tellus"
      />

      {/* Categories Section */}
      <div className="mt-8 mb-[80px] flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 border border-[#545454] rounded-lg cursor-pointer text-center text-base sm:text-lg md:text-xl lg:text-2xl ${
              selectedCategory === category
                ? "bg-[#FD6F00] text-white"
                : "bg-[#F8F8F8] hover:bg-gray-100"
            }`}
          >
            <p className="font-normal">{category}</p>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[44px] justify-center">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div key={index} className="flex justify-center">
              <ProjectShowCard
                imageSrc={project.imageSrc}
                category={project.category}
                title={project.title}
              />
            </div>
          ))
        ) : (
          <div className="bg-[#FFEBDB] dark:bg-[#333333] w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[450px] xl:h-[450px] rounded-[12px] overflow-hidden">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <button className="mt-4 px-8 py-2 text-white text-lg rounded-lg bg-[#FD6F00]">
                Coming Soon...
              </button>
              <p className="text-lg text-black dark:text-white text-center">
                Stay tuned for our exciting new feature!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
