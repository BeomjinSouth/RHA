import React from 'react';
import { Point, GameState } from '../types';

interface ConstructionAreaProps {
  e: number;
  h: number;
  theta: number;
  F: Point;
  gameState: GameState;
}

const ConstructionArea: React.FC<ConstructionAreaProps> = ({ e, h, F, gameState }) => {
  const width = 450;
  const height = 350;
  const origin = { x: width - 50, y: height - 50 };

  const E: Point = { x: origin.x, y: origin.y - e };
  
  const F_svg: Point = {
    x: origin.x + F.x,
    y: origin.y - F.y,
  };

  const isSuccess = gameState === GameState.Success;
  const isSliding = gameState === GameState.Sliding;

  return (
    <div className="w-full aspect-[4/3] relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Axes */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
          </marker>
        </defs>
        {/* Horizontal axis (DH) */}
        <line x1={origin.x} y1={origin.y} x2={20} y2={origin.y} className="stroke-gray-500" strokeWidth="3" markerEnd="url(#arrow)" />
        {/* Vertical axis (DG) */}
        <line x1={origin.x} y1={origin.y} x2={origin.x} y2={20} className="stroke-gray-500" strokeWidth="3" markerEnd="url(#arrow)" />

        {/* Right angle marker for D */}
        <path d={`M ${origin.x} ${origin.y - 15} L ${origin.x - 15} ${origin.y - 15} L ${origin.x - 15} ${origin.y}`} stroke="rgb(239 68 68)" strokeWidth="2" fill="none" />

        {/* Labels for axes */}
        <text x={20} y={origin.y - 10} className="fill-gray-400 text-sm">DH</text>
        <text x={origin.x + 10} y={25} className="fill-gray-400 text-sm">DG</text>

        {/* Success State Polygon */}
        {isSuccess && (
          <polygon 
            points={`${origin.x},${origin.y} ${E.x},${E.y} ${F_svg.x},${F_svg.y}`}
            className="fill-green-500/30 stroke-green-400"
            strokeWidth="2"
          />
        )}
        
        {/* Sliding State Line */}
        {(isSliding || isSuccess) && h > 0 && (
          <line x1={E.x} y1={E.y} x2={F_svg.x} y2={F_svg.y} className={`stroke-2 ${isSuccess ? 'stroke-green-400' : 'stroke-yellow-400'}`} />
        )}

        {/* Points */}
        <g>
          <circle cx={origin.x} cy={origin.y} r="5" className="fill-white" />
          <text x={origin.x + 10} y={origin.y + 15} className="fill-white font-bold text-lg">D</text>
        </g>

        {(isSliding || isSuccess) && h > 0 && (
          <>
            <g>
              <circle cx={E.x} cy={E.y} r="5" className="fill-yellow-400" />
              <text x={E.x - 20} y={E.y} className="fill-white font-bold text-lg">E</text>
            </g>

            <g>
              <circle cx={F_svg.x} cy={F_svg.y} r="5" className="fill-yellow-400" />
              <text x={F_svg.x} y={F_svg.y + 20} className="fill-white font-bold text-lg">F</text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

export default ConstructionArea;