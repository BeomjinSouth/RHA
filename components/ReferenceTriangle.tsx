import React from 'react';
import { Point, GameState } from '../types';

interface ReferenceTriangleProps {
  A: Point;
  B: Point;
  C: Point;
  onHypotenuseSelect: () => void;
  gameState: GameState;
}

const vertexRadius = 6;

const ReferenceTriangle: React.FC<ReferenceTriangleProps> = ({ A, B, C, onHypotenuseSelect, gameState }) => {
  const angleArcPath = () => {
    const radius = 20;
    const vBA = { x: A.x - B.x, y: A.y - B.y };
    const vBC = { x: C.x - B.x, y: C.y - B.y };
    
    const magBA = Math.hypot(vBA.x, vBA.y);
    if (magBA === 0) return "";
    const startX = B.x + (vBA.x / magBA) * radius;
    const startY = B.y + (vBA.y / magBA) * radius;
    
    const magBC = Math.hypot(vBC.x, vBC.y);
    if (magBC === 0) return "";
    const endX = B.x + (vBC.x / magBC) * radius;
    const endY = B.y + (vBC.y / magBC) * radius;

    const cornerX = B.x + (vBA.x / magBA + vBC.x / magBC) * radius;
    const cornerY = B.y + (vBA.y / magBA + vBC.y / magBC) * radius;

    return `M ${startX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${endY}`;
  };

  const thetaArcPath = () => {
    const radius = 25;
    const vAB = { x: B.x - A.x, y: B.y - A.y };
    const vAC = { x: C.x - A.x, y: C.y - A.y };
    
    const startAngle = Math.atan2(vAB.y, vAB.x);
    const endAngle = Math.atan2(vAC.y, vAC.x);

    const startX = A.x + radius * Math.cos(startAngle);
    const startY = A.y + radius * Math.sin(startAngle);
    const endX = A.x + radius * Math.cos(endAngle);
    const endY = A.y + radius * Math.sin(endAngle);

    return `M ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY}`;
  };

  const isHypotenuseClickable = gameState === GameState.Idle;

  return (
    <div className="w-full aspect-square relative">
      <svg viewBox="0 0 340 340" className="w-full h-full">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="2" />
        
        {/* Hypotenuse AC */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className={`stroke-2 transition-all duration-200 ${isHypotenuseClickable ? 'stroke-yellow-400 cursor-pointer hover:stroke-yellow-300 hover:stroke-[4px]' : 'stroke-cyan-400'}`} onClick={onHypotenuseSelect} />

        {/* Right angle marker */}
        <path d={angleArcPath()} stroke="rgb(239 68 68)" strokeWidth="2" fill="none" />

        {/* Angle Theta marker */}
        <path d={thetaArcPath()} stroke="rgb(56 189 248)" strokeWidth="2" fill="none" />


        {/* Vertices */}
        <g>
          <circle cx={A.x} cy={A.y} r={vertexRadius} className={`transition-all duration-200 ${isHypotenuseClickable ? 'fill-yellow-400 cursor-pointer hover:fill-yellow-300' : 'fill-cyan-400'}`} onClick={isHypotenuseClickable ? onHypotenuseSelect : undefined}/>
          <text x={A.x - 20} y={A.y} className="fill-white font-bold text-lg select-none" style={{pointerEvents: 'none'}}>A</text>
        </g>
        <g>
          <circle cx={B.x} cy={B.y} r={vertexRadius} className="fill-red-500" />
          <text x={B.x + 10} y={B.y + 20} className="fill-white font-bold text-lg select-none" style={{pointerEvents: 'none'}}>B</text>
        </g>
         <g>
          <circle cx={C.x} cy={C.y} r={vertexRadius} className={`transition-all duration-200 ${isHypotenuseClickable ? 'fill-yellow-400 cursor-pointer hover:fill-yellow-300' : 'fill-cyan-400'}`} onClick={onHypotenuseSelect}/>
          <text x={C.x - 20} y={C.y + 15} className="fill-white font-bold text-lg select-none" style={{pointerEvents: 'none'}}>C</text>
        </g>
      </svg>
    </div>
  );
};

export default ReferenceTriangle;
