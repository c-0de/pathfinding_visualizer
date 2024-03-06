export function bfs(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const queue = [];
    queue.push(startNode);
    startNode.isVisited = true;
    while(!!queue.length)
    {
        const currNode = queue.shift();
        //console.log(currNode);
        if(currNode.isWall) continue;
        if(currNode.row < 0 || currNode.row >= 20 || currNode.col < 0 || currNode.col >= 50) return visitedNodesInOrder;
        visitedNodesInOrder.push(currNode);
        if(currNode === finishNode) return visitedNodesInOrder;
        const unvisitedNeighbors = getUnvisitedNeighbors(currNode,grid);
        for(const neighbor of unvisitedNeighbors)
        {
            neighbor.isVisited=true;
            neighbor.distance = currNode.distance + 1;
            neighbor.previousNode = currNode;
            queue.push(neighbor);
        }
    }
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

export function getNodesInShortestPathOrderbfs(finishNode)
{
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while(currentNode !== null)
    {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    //console.log(nodesInShortestPathOrder);
    return nodesInShortestPathOrder;
}

