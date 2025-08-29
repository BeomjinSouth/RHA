import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, Point } from './types';
import ReferenceTriangle from './components/ReferenceTriangle';
import ConstructionArea from './components/ConstructionArea';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [triangleA, setTriangleA] = useState<Point>({ x: 0, y: 0 });
  const [triangleB, setTriangleB] = useState<Point>({ x: 0, y: 0 });
  const [triangleC, setTriangleC] = useState<Point>({ x: 0, y: 0 });
  const [trueH, setTrueH] = useState<number>(0);
  const [trueTheta, setTrueTheta] = useState<number>(0);
  const [h, setH] = useState<number>(0);
  const [theta, setTheta] = useState<number>(0); // User-controlled angle
  const [e, setE] = useState<number>(50);

  const generateRandomTriangle = useCallback(() => {
    const h_int = Math.floor(Math.random() * 101) + 150; // 150-250
    const theta_int = Math.floor(Math.random() * 51) + 20; // 20-70 degrees

    setTrueH(h_int);
    setTrueTheta(theta_int);

    const thetaRad = (theta_int * Math.PI) / 180;
    const sideAB = h_int * Math.cos(thetaRad); 
    const sideBC = h_int * Math.sin(thetaRad);

    const bX = 280;
    const bY = 280;

    setTriangleB({ x: bX, y: bY });
    setTriangleA({ x: bX, y: bY - sideAB });
    setTriangleC({ x: bX - sideBC, y: bY });

    setGameState(GameState.Idle);
    setH(0);
    setTheta(0);
    setE(50);
  }, []);

  useEffect(() => {
    generateRandomTriangle();
  }, [generateRandomTriangle]);

  const handleHypotenuseSelect = useCallback(() => {
    if (gameState === GameState.Idle) {
      setH(trueH);
      setTheta(45); // Set an initial angle for the user to start with
      setGameState(GameState.Sliding);
    }
  }, [gameState, trueH]);
  
  const thetaRad = useMemo(() => (theta * Math.PI) / 180, [theta]);
  const trueThetaRad = useMemo(() => (trueTheta * Math.PI) / 180, [trueTheta]);
  
  const F = useMemo(() => {
    if (!h) return { x: 0, y: 0 };
    return {
      x: -h * Math.sin(thetaRad),
      y: e - h * Math.cos(thetaRad),
    };
  }, [e, h, thetaRad]);
  
  const eMax = useMemo(() => {
    if(!h) return 200;
    // Calculate eMax based on the target angle to ensure the solution is reachable
    const target = h * Math.cos(trueThetaRad || (45 * Math.PI / 180));
    return Math.max(target * 1.5, h, 100);
  }, [h, trueThetaRad]);
  
  const targetE = useMemo(() => h * Math.cos(trueThetaRad), [h, trueThetaRad]);

  useEffect(() => {
    if (gameState === GameState.Sliding) {
      const positionTolerance = 1.5;
      const angleTolerance = 1.0; // degrees
      if (Math.abs(F.y) <= positionTolerance && Math.abs(theta - trueTheta) <= angleTolerance) {
        setE(targetE); // Snap to correct position
        setTheta(trueTheta); // Snap to correct angle
        setGameState(GameState.Success);
      }
    }
  }, [F.y, gameState, targetE, theta, trueTheta]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 font-sans">
      <header className="w-full max-w-7xl mx-auto text-center mb-6">
        <h1 className="text-4xl font-bold text-cyan-400">RHA 합동 시각적 탐구</h1>
        <p className="text-lg text-gray-400 mt-2">직각-빗변-예각 조건이 어떻게 유일한 삼각형을 결정하는지 확인해보세요.</p>
      </header>
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
           <ReferenceTriangle 
             A={triangleA} B={triangleB} C={triangleC}
             onHypotenuseSelect={handleHypotenuseSelect}
             gameState={gameState}
           />
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
           <ConstructionArea e={e} h={h} theta={theta} F={F} gameState={gameState} />
        </div>
      </main>
      <footer className="w-full max-w-7xl mx-auto mt-6">
        <ControlPanel 
          gameState={gameState}
          h={h}
          theta={theta}
          trueTheta={trueTheta}
          e={e}
          F={F}
          eMax={eMax}
          onSliderChange={(newE) => {
            if (gameState === GameState.Sliding || gameState === GameState.Success) {
              if (gameState !== GameState.Success) setGameState(GameState.Sliding);
              setE(newE);
            }
          }}
          onThetaSliderChange={(newTheta) => {
            if (gameState === GameState.Sliding || gameState === GameState.Success) {
              if (gameState !== GameState.Success) setGameState(GameState.Sliding);
              setTheta(newTheta);
            }
          }}
          onReset={generateRandomTriangle}
        />
      </footer>
      
      {gameState === GameState.Success && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-success-fade-in">
          <div className="bg-gray-800 border-2 border-green-500 rounded-xl shadow-2xl p-8 text-center transform animate-success-scale-in">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <h2 className="text-3xl font-bold text-green-400">RHA 조건 충족!</h2>
            <p className="text-lg text-gray-300 mt-2">빗변(H)과 예각(A)이 일치하여<br/>단 하나의 삼각형이 결정되었습니다.</p>
            <button 
              onClick={generateRandomTriangle}
              className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition-transform duration-150 active:scale-95"
            >
              다시하기
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes success-modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes success-modal-scale-in {
          from { transform: scale(0.7) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-success-fade-in {
          animation: success-modal-fade-in 0.3s ease-out forwards;
        }
        .animate-success-scale-in {
          animation: success-modal-scale-in 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;