import React, { useState, useCallback } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { GraphEdge, EdgeRelationship } from "../types";

interface Node {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  group: "ancient" | "stoic" | "existential" | "literature" | "arts" | "architecture";
}

const NODES: Node[] = [
  // Ancient
  { id: "socrates", label: "Socrates", x: 50, y: 20, group: "ancient" },
  { id: "plato", label: "Plato", x: 35, y: 35, group: "ancient" },
  { id: "aristotle", label: "Aristotle", x: 65, y: 30, group: "ancient" },

  // Stoic
  { id: "zeno", label: "Zeno of Citium", x: 20, y: 50, group: "stoic" },
  { id: "epictetus", label: "Epictetus", x: 15, y: 70, group: "stoic" },
  { id: "seneca", label: "Seneca", x: 30, y: 65, group: "stoic" },
  { id: "marcus", label: "Marcus Aurelius", x: 25, y: 85, group: "stoic" },

  // Existential
  { id: "kierkegaard", label: "Kierkegaard", x: 80, y: 50, group: "existential" },
  { id: "nietzsche", label: "Nietzsche", x: 75, y: 65, group: "existential" },
  { id: "sartre", label: "Sartre", x: 65, y: 80, group: "existential" },
  { id: "camus", label: "Albert Camus", x: 85, y: 85, group: "existential" },
  { id: "beauvoir", label: "Simone de Beauvoir", x: 70, y: 95, group: "existential" },

  // Literature
  { id: "shakespeare", label: "Shakespeare", x: 20, y: 15, group: "literature" },
  { id: "dostoevsky", label: "Dostoevsky", x: 60, y: 10, group: "literature" },
  { id: "kafka", label: "Kafka", x: 80, y: 25, group: "literature" },

  // Arts
  { id: "davinci", label: "Da Vinci", x: 10, y: 35, group: "arts" },
  { id: "michelangelo", label: "Michelangelo", x: 25, y: 25, group: "arts" },
  { id: "vangogh", label: "Van Gogh", x: 90, y: 35, group: "arts" },

  // Architecture
  { id: "gaudi", label: "Gaudi", x: 90, y: 15, group: "architecture" },
  { id: "wright", label: "Frank Lloyd Wright", x: 10, y: 80, group: "architecture" },
  { id: "corbusier", label: "Le Corbusier", x: 15, y: 95, group: "architecture" },
];

const EDGES: GraphEdge[] = [
  { from: "socrates", to: "plato", relationship: "Influenced" },
  { from: "plato", to: "aristotle", relationship: "Influenced" },

  { from: "socrates", to: "zeno", relationship: "Influenced", dashed: true },
  { from: "zeno", to: "epictetus", relationship: "Influenced" },
  { from: "zeno", to: "seneca", relationship: "Influenced" },
  { from: "epictetus", to: "marcus", relationship: "Influenced" },
  { from: "seneca", to: "marcus", relationship: "Contemporaries" },

  { from: "socrates", to: "kierkegaard", relationship: "Influenced", dashed: true },
  { from: "kierkegaard", to: "nietzsche", relationship: "Critiqued" },
  { from: "nietzsche", to: "sartre", relationship: "Influenced" },
  { from: "nietzsche", to: "camus", relationship: "Influenced" },
  { from: "sartre", to: "camus", relationship: "Contradicts" },
  { from: "sartre", to: "beauvoir", relationship: "Contemporaries" },

  { from: "davinci", to: "michelangelo", relationship: "Contemporaries" },
  { from: "socrates", to: "davinci", relationship: "Inspired", dashed: true },
  { from: "shakespeare", to: "dostoevsky", relationship: "Inspired", dashed: true },
  { from: "dostoevsky", to: "kafka", relationship: "Inspired" },
  { from: "dostoevsky", to: "nietzsche", relationship: "Inspired", dashed: true },
  { from: "kierkegaard", to: "kafka", relationship: "Inspired", dashed: true },
  { from: "vangogh", to: "camus", relationship: "Inspired", dashed: true },
  { from: "gaudi", to: "vangogh", relationship: "Contemporaries", dashed: true },
  { from: "wright", to: "corbusier", relationship: "Critiqued" },
];

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#020202] overflow-hidden"
    >
      {/* Dynamic Background Stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* Header UI */}
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

      {/* Legend */}
      <div className="absolute bottom-8 left-8 z-20 flex flex-wrap gap-3">
        {(["Influenced", "Critiqued", "Contradicts", "Contemporaries", "Inspired"] as EdgeRelationship[]).map((rel) => (
          <div key={rel} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: getRelationshipColor(rel) }} />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{rel}</span>
          </div>
        ))}
      </div>

      {/* The Map */}
      <div className="absolute inset-0">
        <svg className="w-full h-full relative z-0">
          {/* Edges */}
          {EDGES.map((edge, idx) => {
            const fromNode = NODES.find(n => n.id === edge.from);
            const toNode = NODES.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
            const isFaded = hoveredNode && !isHovered;

            // Midpoint for label positioning
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            // Calculate angle for label rotation
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            // Keep text readable (not upside down)
            const adjustedAngle = angle > 90 || angle < -90 ? angle + 180 : angle;

            return (
              <g key={`edge-${idx}`}>
                <motion.line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isHovered ? getRelationshipColor(edge.relationship) : "rgba(255,255,255,0.12)"}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray={edge.dashed ? "4 4" : "none"}
                  className="transition-all duration-500"
                  style={{ opacity: isFaded ? 0.05 : 1 }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isFaded ? 0.05 : 1 }}
                  transition={{ duration: 1.5, delay: 0.5 + idx * 0.05 }}
                />

                {/* Edge relationship label — visible on hover */}
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
          })}
        </svg>

        {/* Nodes */}
        {NODES.map((node, idx) => {
          const isHovered = hoveredNode === node.id;
          const isFaded = hoveredNode && !isHovered;

          // Determine color based on group
          let colorClass = "bg-white";
          let glowClass = "shadow-[0_0_15px_rgba(255,255,255,0.5)]";
          if (node.group === "stoic") {
            colorClass = "bg-amber-200";
            glowClass = "shadow-[0_0_15px_rgba(251,191,36,0.5)]";
          } else if (node.group === "existential") {
            colorClass = "bg-blue-200";
            glowClass = "shadow-[0_0_15px_rgba(191,219,254,0.5)]";
          } else if (node.group === "literature") {
            colorClass = "bg-rose-300";
            glowClass = "shadow-[0_0_15px_rgba(253,164,175,0.5)]";
          } else if (node.group === "arts") {
            colorClass = "bg-purple-300";
            glowClass = "shadow-[0_0_15px_rgba(216,180,254,0.5)]";
          } else if (node.group === "architecture") {
            colorClass = "bg-emerald-300";
            glowClass = "shadow-[0_0_15px_rgba(110,231,183,0.5)]";
          }

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: isFaded ? 0.2 : 1 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.label)}
            >
              <div className="relative group flex flex-col items-center justify-center">
                {/* Ping animation for active look */}
                {isHovered && (
                  <span className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${colorClass}`}></span>
                  </span>
                )}

                {/* The Star */}
                <div className={`w-3 h-3 rounded-full ${colorClass} ${glowClass} transition-transform duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`} />

                {/* Label */}
                <div className={`absolute top-5 whitespace-nowrap text-sm font-semibold transition-all duration-300 ${isHovered ? 'text-white' : 'text-white/60'}`}>
                  {node.label}
                </div>

                {/* Click hint on hover */}
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
        })}
      </div>
    </motion.div>
  );
});
