import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import type {
  Node,
  GraphEdge,
  EdgeRelationship,
} from "@/src/features/graph/types";

interface ConstellationData {
  nodes: Node[];
  edges: GraphEdge[];
}

// Multiple components (ConstellationMap, one MiniConstellation per trail card)
// mount this hook at once. Cache the result and share one in-flight request so
// they don't each fire their own pair of Supabase queries for the same data.
let cachedData: ConstellationData | null = null;
let inFlightPromise: Promise<ConstellationData> | null = null;

async function fetchConstellationData(): Promise<ConstellationData> {
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

  return { nodes: fetchedNodes, edges: fetchedEdges };
}

export function useConstellation() {
  const [nodes, setNodes] = useState<Node[]>(cachedData?.nodes ?? []);
  const [edges, setEdges] = useState<GraphEdge[]>(cachedData?.edges ?? []);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    cachedData = null;
    inFlightPromise = null;
    setIsLoading(true);
    setError(null);
    
    inFlightPromise = fetchConstellationData().catch((err) => {
      inFlightPromise = null;
      throw err;
    });
    
    inFlightPromise
      .then((data) => {
        cachedData = data;
        setNodes(data.nodes);
        setEdges(data.edges);
        setIsLoading(false);
      })
      .catch((err: any) => {
        console.error("Error fetching constellation data:", err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cachedData) return;
    let isMounted = true;

    if (!inFlightPromise) {
      inFlightPromise = fetchConstellationData().catch((err) => {
        inFlightPromise = null;
        throw err;
      });
    }

    inFlightPromise
      .then((data) => {
        cachedData = data;
        if (isMounted) {
          setNodes(data.nodes);
          setEdges(data.edges);
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        console.error("Error fetching constellation data:", err);
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { nodes, edges, isLoading, error, refetch };
}
