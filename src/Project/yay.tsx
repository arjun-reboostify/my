import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Copy
} from 'lucide-react';

interface SkillTile {
  icon: React.ElementType;
  title: string;
  description: string;
  level: number;
}

const skills: SkillTile[] = [
  {
    icon: Brain,
    title: 'Prompt Engineering',
    description: 'can use ai upto the best capabilities',
    level: 100
  },
 

  {
    icon: Copy,
    title: 'Copying',
    description: 'making replica of an project',
    level: 100
  }
];

const PortfolioPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold">MyPortfolio</div>
          <div className="space-x-6">
            {['home', 'skills', 'projects', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize transition-colors ${
                  activeSection === section 
                    ? 'text-blue-400' 
                    : 'text-white hover:text-blue-300'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center text-center"
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl font-bold mb-4">
            Full Stack Developer
          </h1>
          <p className="text-xl text-gray-300">
            Transforming ideas into robust, scalable digital solutions
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section 
        id="skills" 
        className="min-h-screen flex items-center justify-center p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ 
                opacity: 0, 
                x: index % 2 === 0 ? -100 : 100 
              }}
              animate={{ 
                opacity: 1, 
                x: 0 
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2 
              }}
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center mb-4">
                <skill.icon className="w-12 h-12 text-blue-400 mr-4" />
                <h3 className="text-xl font-semibold">{skill.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{skill.description}</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;