export function dfs(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const stack = [];
    stack.push(startNode);
    while(!!stack.length)
    {
        const currNode = stack.pop();
        //console.log(currNode);
        if(currNode.isWall) continue;
        if(currNode.row < 0 || currNode.row >= 20 || currNode.col < 0 || currNode.col >= 50) return visitedNodesInOrder;
        currNode.isVisited = true;
        visitedNodesInOrder.push(currNode);
        if(currNode === finishNode) return visitedNodesInOrder;
        const unvisitedNeighbors = getUnvisitedNeighbors(currNode,grid);
        for(const neighbor of unvisitedNeighbors)
        {
            neighbor.distance = currNode.distance + 1;
            neighbor.previousNode = currNode;
            stack.push(neighbor);
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

export function getNodesInShortestPathOrderdfs(finishNode)
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

