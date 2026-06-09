import React, { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { GraphEdge, EdgeRelationship, Node } from "../types";

import { NODES, EDGES } from "../data/constellationData";

/** Color mapping for relationship types */
function getRelationshipColor(rel: EdgeRelationship): string {
  switch (rel) {
    case "Influenced": return "rgba(181, 164, 139, 0.8)";
    case "Critiqued": return "rgba(239, 68, 68, 0.7)";
    case "Contradicts": return "rgba(249, 115, 22, 0.7)";
    case "Contemporaries": return "rgba(147, 197, 253, 0.7)";
    case "Inspired": return "rgba(167, 139, 250, 0.7)";
  }
}

// ------------------------------------------------------------------
// Memoized Edge Component
// ------------------------------------------------------------------
const ConstellationEdge = React.memo(({ 
  edge, 
  fromNode, 
  toNode, 
  isHovered, 
  isFaded, 
  idx 
}: { 
  edge: GraphEdge, 
  fromNode: Node, 
  toNode: Node, 
  isHovered: boolean, 
  isFaded: boolean, 
  idx: number 
}) => {
  const { midX, midY, adjustedAngle } = useMemo(() => {
    const mX = (fromNode.x + toNode.x) / 2;
    const mY = (fromNode.y + toNode.y) / 2;
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return {
      midX: mX,
      midY: mY,
      adjustedAngle: Math.abs(angle) > 90 ? angle + 180 : angle
    };
  }, [fromNode.x, fromNode.y, toNode.x, toNode.y]);

  return (
    <g>
      <motion.line
        x1={`${fromNode.x}%`}
        y1={`${fromNode.y}%`}
        x2={`${toNode.x}%`}
        y2={`${toNode.y}%`}
        stroke={isHovered ? getRelationshipColor(edge.relationship) : "rgba(255,255,255,0.12)"}
        strokeWidth={isHovered ? 2 : 1}
        strokeDasharray={edge.dashed ? "4 4" : "none"}
        className="transition-all duration-500"
        style={{ opacity: isFaded ? 0.05 : 1, willChange: "opacity" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: isFaded ? 0.05 : 1 }}
        transition={{ duration: 1.5, delay: 0.5 + idx * 0.05, ease: "easeOut" }}
      />

      {isHovered && (
        <text
          x={`${midX}%`}
          y={`${midY}%`}
          textAnchor="middle"
          dominantBaseline="middle"
          className="edge-label"
          fill={getRelationshipColor(edge.relationship)}
          transform={`rotate(${adjustedAngle}, ${midX}%, ${midY}%)`}
          style={{ opacity: 0 }}
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.4s"
            fill="freeze"
          />
          {edge.relationship}
        </text>
      )}
    </g>
  );
});

// ------------------------------------------------------------------
// Memoized Node Component
// ------------------------------------------------------------------
const ConstellationNode = React.memo(({ 
  node, 
  isHovered, 
  isFaded, 
  idx, 
  onHover, 
  onLeave, 
  onClick 
}: { 
  node: Node, 
  isHovered: boolean, 
  isFaded: boolean, 
  idx: number, 
  onHover: (id: string) => void, 
  onLeave: () => void, 
  onClick: (label: string) => void 
}) => {
  const { colorClass, glowClass } = useMemo(() => {
    let c = "bg-white";
    let g = "shadow-[0_0_15px_rgba(255,255,255,0.5)]";
    if (node.group === "stoic") {
      c = "bg-amber-200";
      g = "shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    } else if (node.group === "existential") {
      c = "bg-blue-200";
      g = "shadow-[0_0_15px_rgba(191,219,254,0.5)]";
    } else if (node.group === "literature") {
      c = "bg-rose-300";
      g = "shadow-[0_0_15px_rgba(253,164,175,0.5)]";
    } else if (node.group === "arts") {
      c = "bg-purple-300";
      g = "shadow-[0_0_15px_rgba(216,180,254,0.5)]";
    } else if (node.group === "architecture") {
      c = "bg-emerald-300";
      g = "shadow-[0_0_15px_rgba(110,231,183,0.5)]";
    }
    return { colorClass: c, glowClass: g };
  }, [node.group]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isFaded ? 0.2 : 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8, delay: 0.2 + idx * 0.05 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
      style={{ left: `${node.x}%`, top: `${node.y}%`, willChange: "transform, opacity" }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(node.label)}
    >
      <div className="relative group flex flex-col items-center justify-center">
        {isHovered && (
          <span className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${colorClass}`}></span>
          </span>
        )}

        <div className={`w-3 h-3 rounded-full ${colorClass} ${glowClass} transition-transform duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`} />

        <div className={`absolute top-5 whitespace-nowrap text-sm font-semibold transition-all duration-300 ${isHovered ? 'text-white' : 'text-white/60'}`}>
          {node.label}
        </div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-10 whitespace-nowrap text-[8px] font-mono text-white/30 uppercase tracking-wider"
          >
            Tap to filter stream
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
interface ConstellationMapProps {
  onClose: () => void;
  onFilterByThinker?: (thinkerName: string) => void;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = React.memo(({ onClose, onFilterByThinker }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleNodeClick = useCallback(
    (nodeLabel: string) => {
      if (onFilterByThinker) {
        onFilterByThinker(nodeLabel);
        onClose();
      }
    },
    [onFilterByThinker, onClose]
  );

  const handleHover = useCallback((id: string) => setHoveredNode(id), []);
  const handleLeave = useCallback(() => setHoveredNode(null), []);

  // Pre-map node relationships to avoid repeated lookups
  const nodesMap = useMemo(() => {
    const map = new Map<string, Node>();
    NODES.forEach(n => map.set(n.id, n));
    return map;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#020202] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
        <div>
          <h2 className="text-white text-2xl font-serif italic tracking-tight mb-1">Knowledge Constellation</h2>
          <p className="text-white/40 text-xs tracking-widest uppercase font-mono">Tap a thinker to filter the Stream</p>
        </div>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-8 left-8 z-20 flex flex-wrap gap-3">
        {(["Influenced", "Critiqued", "Contradicts", "Contemporaries", "Inspired"] as EdgeRelationship[]).map((rel) => (
          <div key={rel} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: getRelationshipColor(rel) }} />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{rel}</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        <svg className="w-full h-full relative z-0">
          {EDGES.map((edge, idx) => {
            const fromNode = nodesMap.get(edge.from);
            const toNode = nodesMap.get(edge.to);
            if (!fromNode || !toNode) return null;

            const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
            const isFaded = hoveredNode !== null && !isHovered;

            return (
              <ConstellationEdge
                key={`edge-${idx}`}
                edge={edge}
                fromNode={fromNode}
                toNode={toNode}
                isHovered={isHovered}
                isFaded={isFaded}
                idx={idx}
              />
            );
          })}
        </svg>

        {NODES.map((node, idx) => {
          const isHovered = hoveredNode === node.id;
          const isFaded = hoveredNode !== null && !isHovered;

          return (
            <ConstellationNode
              key={node.id}
              node={node}
              isHovered={isHovered}
              isFaded={isFaded}
              idx={idx}
              onHover={handleHover}
              onLeave={handleLeave}
              onClick={handleNodeClick}
            />
          );
        })}
      </div>
    </motion.div>
  );
});
