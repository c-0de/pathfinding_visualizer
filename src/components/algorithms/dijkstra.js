export function dijkstra(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const queue= [];
    queue.push(startNode);
    while(!!queue.length)
    {
        sortNodesByDistance(queue);
        const currNode = queue.shift();
        console.log(currNode.weight);
        if(currNode.isWall) continue;
        if(currNode.distance === Infinity) return visitedNodesInOrder;
        if(currNode.isVisited == false) currNode.isVisited = true;
        else continue;
        visitedNodesInOrder.push(currNode);
        if(currNode === finishNode) return visitedNodesInOrder;
        const unvisitedNeighbors = getUnvisitedNeighbors(currNode,grid);
        for(const neighbor of unvisitedNeighbors)
        {
            if(currNode.distance + neighbor.weight < neighbor.distance)
                neighbor.distance = currNode.distance + neighbor.weight + 1;
                neighbor.previousNode = currNode;
                queue.push(neighbor);
        }
    }
}

function sortNodesByDistance(unvisitedNodes)
{
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getUnvisitedNeighbors(node, grid)
{
    const neighbors = [];
    const {col,row} = node;
    if(row > 0) neighbors.push(grid[row-1][col]);
    if(row < grid.length - 1) neighbors.push(grid[row+1][col]);
    if(col > 0) neighbors.push(grid[row][col-1]);
    if(col < grid[0].length-1) neighbors.push(grid[row][col+1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

export function getNodesInShortestPathOrder(finishNode)
{
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while(currentNode !== null)
    {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

