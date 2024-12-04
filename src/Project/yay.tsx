import React from 'react';
import IFrame from './Iframe';
import Side from '../components/it/Sidebar'


const PortfolioPage: React.FC = () => {
 

  return (<>
  <Side />
<IFrame 
  src="https://portfolioakd.vercel.app/" 
  className="min-w-screen min-h-screen" 
  
/>
</>
  );
};

export default PortfolioPage;