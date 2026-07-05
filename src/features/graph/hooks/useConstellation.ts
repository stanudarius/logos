import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Node, GraphEdge, EdgeRelationship } from "@/src/features/graph/types";

export function useConstellation() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const [nodesResponse, edgesResponse] = await Promise.all([
          supabase.from("constellation_nodes").select("*"),
          supabase.from("constellation_edges").select("*"),
        ]);

        if (nodesResponse.error) throw nodesResponse.error;
        if (edgesResponse.error) throw edgesResponse.error;

        const fetchedNodes: Node[] = (nodesResponse.data || []).map((n) => ({
          id: n.id,
          label: n.label,
          x: Number(n.pos_x),
          y: Number(n.pos_y),
          group: n.group_name as Node["group"],
        }));

        const fetchedEdges: GraphEdge[] = (edgesResponse.data || []).map((e) => ({
          from: e.from_node,
          to: e.to_node,
          relationship: e.relationship as EdgeRelationship,
          dashed: e.dashed,
        }));

        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
      } catch (err: any) {
        console.error("Error fetching constellation data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { nodes, edges, isLoading, error };
}
