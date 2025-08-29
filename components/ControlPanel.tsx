import React, { useState } from 'react';
import { GameState, Point } from '../types';

interface ControlPanelProps {
  gameState: GameState;
  h: number;
  theta: number;
  trueTheta: number;
  e: number;
  eMax: number;
  F: Point;
  onSliderChange: (value: number) => void;
  onThetaSliderChange: (value: number) => void;
  onReset: () => void;
}

const Quiz: React.FC = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [showHint, setShowHint] = useState<boolean>(false);
    const correctAnswer = 1;

    const options = [0, 1, 2, '무한'];

    const handleSelect = (index: number) => {
        setSelected(index);
        if (index !== correctAnswer) {
            setShowHint(true);
        } else {
            setShowHint(false);
        }
    };

    return (
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h3 className="font-bold text-lg text-cyan-400">간단 퀴즈</h3>
            <p className="mt-1 text-gray-300">RHA 조건(직각, 같은 빗변 길이, 같은 예각)을 만족하는 직각삼각형의 개수는?</p>
            <div className="flex space-x-2 mt-3">
                {options.map((opt, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 font-semibold ${
                            selected === index
                                ? index === correctAnswer
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {showHint && (
                <div className="mt-3 text-sm p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-md">
                    <b>힌트:</b> 빗변의 길이와 예각이 정해지면, 나머지 한 변의 길이(슬라이더가 나타내는 값 'e')도 단 하나의 값으로 결정됩니다. 따라서 삼각형은 하나뿐입니다.
                </div>
            )}
        </div>
    );
};


const ControlPanel: React.FC<ControlPanelProps> = ({ gameState, h, theta, trueTheta, e, eMax, F, onSliderChange, onThetaSliderChange, onReset }) => {
  const getInstruction = () => {
    switch (gameState) {
      case GameState.Idle:
        return '왼쪽에서 노란색 빗변(A-C)을 클릭해 빗변을 선택하세요.';
      case GameState.Sliding:
        return '슬라이더로 E의 위치와 ∠DEF 각도를 조절하여, F가 가로축(DH)에 닿게 하고 목표 각도를 맞추세요.';
      case GameState.Success:
        return '성공! RHA 조건을 만족하는 직각삼각형은 유일합니다.';
      default:
        return '';
    }
  };

  const isSliderDisabled = gameState === GameState.Idle;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-grow">
            <h2 className="text-xl font-bold text-cyan-400">제어판 및 상태</h2>
            <p className="mt-2 h-12 md:h-6 text-lg text-yellow-300">{getInstruction()}</p>
        </div>
        <button onClick={onReset} className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-transform duration-150 active:scale-95">
          새 삼각형
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div className="bg-gray-700/50 p-3 rounded-lg">
              <span className="text-sm text-gray-400 block">빗변 |AC|</span>
              <span className="text-lg font-mono text-white">{h.toFixed(0)}</span>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg">
              <span className="text-sm text-gray-400 block">각도 (현재/목표)</span>
              <span className="text-lg font-mono text-white">{theta.toFixed(1)}° / {trueTheta.toFixed(0)}°</span>
          </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label htmlFor="e-slider" className="text-gray-400">E 슬라이더</label>
          <input
            id="e-slider"
            type="range"
            min="0"
            max={eMax}
            step="0.1"
            value={e}
            onChange={(event) => onSliderChange(parseFloat(event.target.value))}
            disabled={isSliderDisabled}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed mt-2 range-lg"
            style={{ 
              '--thumb-color': isSliderDisabled ? '#6b7280' : '#facc15',
              '--track-color': isSliderDisabled ? '#4b5563' : '#374151',
              background: isSliderDisabled ? '#4b5563' : `linear-gradient(to right, #facc15 0%, #facc15 ${ (e/eMax)*100 }%, #374151 ${ (e/eMax)*100 }%, #374151 100%)`
            } as React.CSSProperties}
          />
        </div>
        <div>
          <label htmlFor="theta-slider" className="text-gray-400">각도 슬라이더 (∠DEF)</label>
          <input
            id="theta-slider"
            type="range"
            min="1"
            max="89"
            step="0.1"
            value={theta}
            onChange={(event) => onThetaSliderChange(parseFloat(event.target.value))}
            disabled={isSliderDisabled}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed mt-2 range-lg"
             style={{ 
              '--thumb-color': isSliderDisabled ? '#6b7280' : '#facc15',
              '--track-color': isSliderDisabled ? '#4b5563' : '#374151',
               background: isSliderDisabled ? '#4b5563' : `linear-gradient(to right, #facc15 0%, #facc15 ${ ((theta-1)/88)*100 }%, #374151 ${ ((theta-1)/88)*100 }%, #374151 100%)`
            } as React.CSSProperties}
          />
        </div>
      </div>
      {gameState === GameState.Success && <Quiz />}
      <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--thumb-color);
            cursor: pointer;
            margin-top: -8px;
          }
          input[type=range]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--thumb-color);
            cursor: pointer;
          }
        `}</style>
    </div>
  );
};

export default ControlPanel;