import aboutMeImage from "../../assets/images/aboutMe-image.png";
import PrograssRange from "../prograss-range/ProgressRange";

const AboutMe = () => {
  return (
    
        
        <div className=" space-y-6 ">
        
          <div>
            <h2 className="text-black dark:text-white text-xl lg:text-2xl font-semibold">
             Watching
            </h2>
            <PrograssRange value={22} />
          </div>

{/*          
          <div>
            <h2 className="text-black dark:text-white text-xl lg:text-2xl font-semibold">
              Web Design
            </h2>
            <PrograssRange value={75} />
          </div>

         
          <div>
            <h2 className="text-black dark:text-white text-xl lg:text-2xl font-semibold">
              Graphic Design
            </h2>
            <PrograssRange value={90} />
          </div>

      
          <div>
            <h2 className="text-black dark:text-white text-xl lg:text-2xl font-semibold">
              App Design
            </h2>
            <PrograssRange value={85} />
          </div> */}
        </div>
      
  );
};

export default AboutMe;
