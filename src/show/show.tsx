import React, { useState, useEffect } from "react";


import A from './a'
import C from './c'
import B from './b'

const Porn: React.FC = () => {
    const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [showC, setShowC] = useState(false);

  useEffect(() => {
    const timerA = setTimeout(() => setShowA(true), 500);
    const timerB = setTimeout(() => setShowB(true), 15000);
    const timerC = setTimeout(() => setShowC(true), 18000);

    return () => {
      clearTimeout(timerA);
      clearTimeout(timerB);
      clearTimeout(timerC);
    };
  }, []);

  return (
    <div>
      {showA && <A />}
      {showB && <B />}
      {showC && <C />}
    </div>
  );
};

export default Porn;
