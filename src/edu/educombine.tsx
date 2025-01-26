import React from "react";
import Nav from './parts/nav'


const SkeletonComponent: React.FC = () => {
  return (<>
  <iframe
        src="https://archive.org/details/datastructures-and-algorithms/mode/1up?view=theater&ui=embed&wrapper=false"
        width="560"
        height="384"
        frameBorder="0"
        allow="fullscreen"
        className="rounded-lg shadow-lg"
      ></iframe>
  </>
   );
};

export default SkeletonComponent;
