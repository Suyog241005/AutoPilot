import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) return nodes;

  //Create edges array for toposort
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  //Add nodes with no connections as self-edges to ensure they are included
  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodesIds: string[];
  try {
    sortedNodesIds = toposort(edges);
    //remove duplicates
    sortedNodesIds = [...new Set(sortedNodesIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }

  //Map sorted Ids to node object
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodesIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
