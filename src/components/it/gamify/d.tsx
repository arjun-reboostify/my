import React, { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface LifeRule {
  id: number;
  heading: string;
  statement: string;
  insight: string;
}

const LIFE_RULES: LifeRule[] = [
  {
    id: 1,
    heading: "Stay Silent",
    statement: "no need to tell what you are doing thinking building or anything about you or related to you talk external or stay super silent ",
    insight: "being silent is like being in a suck but you will definitely find yourself and save to much time"
  },
  {
    id: 2,
    heading: "Say no",
    statement: "no need to please any organism if the action not aligned to your definred grater purpose say no and move on",
    insight: "when the distance is unknown and your spirits , mind and body is broken you get to know who the fuck you are"
  },
  {
    id: 3,
    heading: "Try atleast",
    statement: "just push 1 second further in the suck as .1% doing is better than to do nil",
    insight: "you will die and life is short so dont make it regretful atleast in a day try to perform the action just start even in uncomfortable situation and after than jsut make the 1 second decisions as in that 1 second you can win yourself and do the post mortem of your body brain and mind yourself or someone else will when you die "
  },
  {
    id: 4,
    heading: "be alone",
    statement: "think deeply living like a lone wolf is a boon you got one life one shot and the most important thng you can do is make your mind your friend as it is the gretest weapon as it can work for you or against you and when you are lone you find your true friend your mind ",
    insight: "you start to become brave and you let go of the fear of anything you choose reality and discard the matrix "
  },
  {
    id: 5,
    heading: "priortise health",
    statement: "in the long run try to end up by your own will and not by a health condition . important one are eat clean , and living, get good sleep meditate wear spectacles and mask",
    insight: "you become less pathetic"
  },
  {
    id: 6,
    heading: "3rd perpective",
    statement: "in order to control your focus and and of mind , get your imaginative view outside your boby and view yourself in 3rd person who is watching you from a distance",
    insight: "you get to know your configuration well and make best decisions"
  },
  {
    id: 7,
    heading: "Be disliked ",
    statement: "human are social animal the is natres matrix so to get out of every matrix break the natures one then only in your view you become the god himself so try to be get disliked from everyone ",
    insight: "a step towards no attachments and desires "
  },
  {
    id: 8,
    heading: "no preservation ",
    statement: "use your body at its max many peopleburn or bury their well preserved body there no scars on then no bruises no cuts no burns just well mainted body sooo pathetic it your body break yourself off and abuse the power of will on your body",
    insight: "in the suck you erase yourself and get transcend out of this painful marshy place"
  },
  {
    id: 9,
    heading: "never settle",
    statement: "keep moving any of your body part constantly untill you get switch off and run again after getting consciousness never stop untill you are getting conscience and feelin of being in the matrix you can leave it by knowing pain and imagination are jsut mental state not a threat",
    insight: "no regrets"
  },
  {
    id: 10,
    heading: "Everytime Showup",
    statement: "you can only try when you showup to the place where it is meant to try.",
    insight: "never know more jsut do it"
  }
  // More rules can be added here
];

const LifeRulesNotebook: React.FC = () => {
  const [activeRule, setActiveRule] = useState<LifeRule>(LIFE_RULES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const ruleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const scrollToRule = (ruleId: number) => {
    const ruleElement = ruleRefs.current[ruleId - 1];
    if (ruleElement) {
      mainContentRef.current?.scrollTo({
        top: ruleElement.offsetTop,
        behavior: 'smooth'
      });
      setActiveRule(LIFE_RULES.find(rule => rule.id === ruleId) || LIFE_RULES[0]);
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="relative flex bg-gradient-to-br from-gray-900 to-black text-white min-h-screen overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed z-50 top-4 right-4 md:hidden bg-blue-600 p-2 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X color="white" /> : <Menu color="white" />}
      </button>

      {/* Navigation Sidebar */}
      <nav 
        className={`
          fixed top-0 right-0 w-72 h-full bg-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:translate-x-0 md:block
          overflow-y-auto z-40
        `}
      >
        <div className="sticky top-0 bg-gray-800 p-4 z-10">
          <h2 className="text-xl font-bold mb-4">Life Rules Navigation</h2>
        </div>
        <ul className="px-2 pb-4 space-y-1">
          {LIFE_RULES.map((rule) => (
            <li 
              key={rule.id}
              className={`
                cursor-pointer p-2 rounded 
                ${activeRule.id === rule.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-700'}
                transition-colors duration-200
              `}
              onClick={() => scrollToRule(rule.id)}
            >
              Rule {rule.id}: {rule.heading}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main 
        ref={mainContentRef}
        className="flex-1 p-4 md:p-8 overflow-y-auto relative"
      >
        <h1 className="text-4xl font-bold mb-8 sticky top-0 bg-gradient-to-br from-gray-900 to-black z-10 pt-4">
          Life Wisdom Rulebook
        </h1>
        {LIFE_RULES.map((rule, index) => (
          <div 
            key={rule.id} 
            ref={(el) => ruleRefs.current[index] = el}
            className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Rule {rule.id}: {rule.heading}
            </h2>
            <p className="text-lg mb-4 italic text-gray-200">
              "{rule.statement}"
            </p>
            <div className="text-gray-300">
              <strong>Insight:</strong> {rule.insight}
            </div>
          </div>
        ))}
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}
    </div>
  );
};

export default LifeRulesNotebook;