import Tower from "./interfaces/Tower";

const LINK_DIST = 100;

// Find towers within LINK_DIST distance from specified tower
function findNeighbours(towers: Array<Tower>, tower: Tower) {
  let neighbours: Array<Tower> = [];
  for (const t of towers) {
    if (
      Math.abs(tower.x - t.x) > LINK_DIST ||
      Math.abs(tower.y - t.y) > LINK_DIST ||
      t === tower
    )
      continue;
    neighbours.push(t);
  }
  return neighbours;
}

function linkNodes(nodes: Array<Tower>) {
  const startNode = nodes.find((n) => n.linked);
  if (startNode === undefined) return;
  let closed = Array<Tower>();

  let open = [startNode];

  while (open.length > 0) {
    const node = open.pop()!;
    if (!node.linked || closed.includes(node)) continue;
    for (let neighbour of node.neighbours) {
      if (node.kingdom !== neighbour.kingdom && (node.kingdom !== "planned" && neighbour.kingdom !== "planned"))
        continue;
      neighbour.linked = true;
      open.push(neighbour);
    }
    closed.push(node);
  }
}

export default function CalculateLinks(towers: Array<Tower>) {
  for (let tower of towers) {
    tower.neighbours = findNeighbours(towers, tower);
  }

  linkNodes(towers);
}
