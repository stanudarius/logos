import React from "react";
import { useConstellation } from "@/src/features/graph/hooks/useConstellation";

interface MiniConstellationProps {
  thinkerIds: string[];
}

const MiniConstellation: React.FC<MiniConstellationProps> = React.memo(
  ({ thinkerIds }) => {
    const { nodes, edges: graphEdges, isLoading } = useConstellation();

    const { primaryNodes, contextNodes, edgesToDraw, viewBox, nodesMap } =
      React.useMemo(() => {
        if (isLoading || nodes.length === 0) {
          return {
            primaryNodes: [],
            contextNodes: [],
            edgesToDraw: [],
            viewBox: "0 0 100 100",
            nodesMap: new Map(),
          };
        }

        const nMap = new Map(nodes.map((n) => [n.id, n]));

        const primary = nodes.filter((n) =>
          thinkerIds.some((t) => {
            const query = t.toLowerCase();
            const id = n.id.toLowerCase();
            const label = n.label.toLowerCase();
            return (
              query === id ||
              query === label ||
              query.includes(id) ||
              label.includes(query)
            );
          }),
        );

        if (primary.length === 0) {
          return {
            primaryNodes: [],
            contextNodes: [],
            edgesToDraw: [],
            viewBox: "0 0 100 100",
            nodesMap: nMap,
          };
        }

        let active = [...primary];
        let edges = [];
        let context = [];

        if (primary.length === 1) {
          const pId = primary[0].id;
          edges = graphEdges.filter((e) => e.from === pId || e.to === pId);
          const connectedIds = new Set(edges.flatMap((e) => [e.from, e.to]));
          context = nodes.filter((n) => connectedIds.has(n.id) && n.id !== pId);
          active = [...primary, ...context];
        } else {
          const primaryIds = new Set(primary.map((n) => n.id));
          edges = graphEdges.filter(
            (e) => primaryIds.has(e.from) && primaryIds.has(e.to),
          );
        }

        const minX = Math.min(...active.map((n) => n.x));
        const maxX = Math.max(...active.map((n) => n.x));
        const minY = Math.min(...active.map((n) => n.y));
        const maxY = Math.max(...active.map((n) => n.y));

        const paddingX = 15;
        const paddingY = 15;
        const viewBoxWidth = maxX - minX + paddingX * 2;
        const viewBoxHeight = maxY - minY + paddingY * 2;

        return {
          primaryNodes: primary,
          contextNodes: context,
          edgesToDraw: edges,
          viewBox: `${minX - paddingX} ${minY - paddingY} ${viewBoxWidth} ${viewBoxHeight}`,
          nodesMap: nMap,
        };
      }, [thinkerIds, nodes, graphEdges, isLoading]);

    if (primaryNodes.length === 0) return null;

    return (
      <div className="w-full h-[72px] rounded-xl bg-[#F5F3ED] overflow-hidden relative border border-[#E8E4DC] flex items-center justify-center">
        <svg
          viewBox={viewBox}
          className="w-full h-full opacity-80"
          preserveAspectRatio="xMidYMid meet"
        >
          {edgesToDraw.map((edge, idx) => {
            const fromNode = nodesMap.get(edge.from);
            const toNode = nodesMap.get(edge.to);
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

          {contextNodes.map((node) => (
            <g key={`ctx-${node.id}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={2}
                fill="#B5A48B"
                className="opacity-40"
              />
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

          {primaryNodes.map((node) => (
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
  },
);

export default MiniConstellation;
