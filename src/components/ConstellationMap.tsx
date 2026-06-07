import React, { useState } from "react";
import { motion } from "motion/react";
import { X, ZoomIn } from "lucide-react";

interface Node {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  group: "ancient" | "stoic" | "existential" | "literature" | "arts" | "architecture";
}

interface Edge {
  from: string;
  to: string;
  dashed?: boolean;
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

const EDGES: Edge[] = [
  { from: "socrates", to: "plato" },
  { from: "plato", to: "aristotle" },
  
  { from: "socrates", to: "zeno", dashed: true },
  { from: "zeno", to: "epictetus" },
  { from: "zeno", to: "seneca" },
  { from: "epictetus", to: "marcus" },
  { from: "seneca", to: "marcus" },

  { from: "socrates", to: "kierkegaard", dashed: true },
  { from: "kierkegaard", to: "nietzsche" },
  { from: "nietzsche", to: "sartre" },
  { from: "nietzsche", to: "camus" },
  { from: "sartre", to: "camus" },
  { from: "sartre", to: "beauvoir" },

  { from: "davinci", to: "michelangelo" },
  { from: "socrates", to: "davinci", dashed: true },
  { from: "shakespeare", to: "dostoevsky", dashed: true },
  { from: "dostoevsky", to: "kafka" },
  { from: "dostoevsky", to: "nietzsche", dashed: true },
  { from: "kierkegaard", to: "kafka", dashed: true },
  { from: "vangogh", to: "camus", dashed: true },
  { from: "gaudi", to: "vangogh", dashed: true },
  { from: "wright", to: "corbusier" },
];

interface ConstellationMapProps {
  onClose: () => void;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = ({ onClose }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
          <p className="text-white/40 text-xs tracking-widest uppercase font-mono">Map of Human Thought</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
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

            return (
              <motion.line
                key={`edge-${idx}`}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray={edge.dashed ? "4 4" : "none"}
                className="transition-all duration-500"
                style={{ opacity: isFaded ? 0.1 : 1 }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isFaded ? 0.1 : 1 }}
                transition={{ duration: 1.5, delay: 0.5 + idx * 0.05 }}
              />
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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-default z-10"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="relative group flex flex-col items-center justify-center">
                {/* Ping animation for active look */}
                {isHovered && (
                  <span className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${colorClass}`}></span>
                  </span>
                )}
                
                {/* The Star */}
                <div className={`w-3 h-3 rounded-full ${colorClass} ${glowClass} transition-transform duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`} />
                
                {/* Label */}
                <div className={`absolute top-5 whitespace-nowrap text-sm font-semibold transition-all duration-300 ${isHovered ? 'text-white' : 'text-white/60'}`}>
                  {node.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
