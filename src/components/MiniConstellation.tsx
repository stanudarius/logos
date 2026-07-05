import React from "react";
import { NODES, EDGES } from "../data/constellationData";

interface MiniConstellationProps {
  thinkerIds: string[];
}

const MiniConstellation: React.FC<MiniConstellationProps> = React.memo(({ thinkerIds }) => {
  const { primaryNodes, contextNodes, edgesToDraw, viewBox } = React.useMemo(() => {
    // 1. Find the primary nodes that belong to this trail
    const primary = NODES.filter(n =>
      thinkerIds.some(t => {
        const query = t.toLowerCase();
        const id = n.id.toLowerCase();
        const label = n.label.toLowerCase();
        return query === id || query === label || query.includes(id) || label.includes(query);
      })
    );

    if (primary.length === 0) {
      return { primaryNodes: [], contextNodes: [], edgesToDraw: [], viewBox: "0 0 100 100" };
    }

    let active = [...primary];
    let edges: typeof EDGES = [];
    let context: typeof NODES = [];

    // 2. If it's a single-thinker trail, fetch their neighborhood (edges + connected nodes)
    if (primary.length === 1) {
      const pId = primary[0].id;
      edges = EDGES.filter(e => e.from === pId || e.to === pId);
      const connectedIds = new Set(edges.flatMap(e => [e.from, e.to]));
      context = NODES.filter(n => connectedIds.has(n.id) && n.id !== pId);
      active = [...primary, ...context];
    } else {
      // 3. For multi-thinker trails, only show edges between the primary nodes
      const primaryIds = new Set(primary.map(n => n.id));
      edges = EDGES.filter(e => primaryIds.has(e.from) && primaryIds.has(e.to));
    }

    // 4. Find min/max x and y to calculate a tight bounding box
    const minX = Math.min(...active.map(n => n.x));
    const maxX = Math.max(...active.map(n => n.x));
    const minY = Math.min(...active.map(n => n.y));
    const maxY = Math.max(...active.map(n => n.y));

    // Add padding
    const paddingX = 15;
    const paddingY = 15;
    const viewBoxWidth = (maxX - minX) + paddingX * 2;
    const viewBoxHeight = (maxY - minY) + paddingY * 2;

    return {
      primaryNodes: primary,
      contextNodes: context,
      edgesToDraw: edges,
      viewBox: `${minX - paddingX} ${minY - paddingY} ${viewBoxWidth} ${viewBoxHeight}`
    };
  }, [thinkerIds]);

  if (primaryNodes.length === 0) return null;

  return (
    <div className="w-full h-24 rounded-xl bg-[#F5F3ED] overflow-hidden relative mb-4 border border-[#E8E4DC] flex items-center justify-center">
      <svg
        viewBox={viewBox}
        className="w-full h-full opacity-80"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Draw edges */}
        {edgesToDraw.map((edge, idx) => {
          const fromNode = NODES.find(n => n.id === edge.from);
          const toNode = NODES.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`edge-${idx}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#B5A48B"
              strokeWidth={1}
              strokeDasharray={edge.dashed ? "2 2" : "none"}
              className="opacity-30"
            />
          );
        })}

        {/* Draw context (neighborhood) nodes */}
        {contextNodes.map(node => (
          <g key={`ctx-${node.id}`}>
            <circle cx={node.x} cy={node.y} r={2} fill="#B5A48B" className="opacity-40" />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize="3"
              fill="#B5A48B"
              className="font-sans opacity-50 uppercase tracking-widest"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Draw primary nodes */}
        {primaryNodes.map(node => (
          <g key={`pri-${node.id}`}>
            <circle cx={node.x} cy={node.y} r={3.5} fill="#1C1C1E" />
            <text
              x={node.x}
              y={node.y + 6}
              textAnchor="middle"
              fontSize="4"
              fill="#1C1C1E"
              fontWeight="bold"
              className="font-sans uppercase tracking-widest"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
});

export default MiniConstellation;
