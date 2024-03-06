import React,{Component} from 'react';
import Node from './Node';
import './PathfindingVisualizer.css';
import {dijkstra, getNodesInShortestPathOrder} from './algorithms/dijkstra';
import {bfs, getNodesInShortestPathOrderbfs} from './algorithms/bfs';
import {dfs, getNodesInShortestPathOrderdfs} from './algorithms/dfs';

let START_NODE_ROW = 3;
let START_NODE_COL = 5;
let FINISH_NODE_ROW = 16;
let FINISH_NODE_COL = 45;
let t_menu;
let visitedNodesInOrder = [];
let nodesInShortestPathOrder = [];
let bfs_t0;
let bfs_t1
let dfs_t0;
let dfs_t1;
let d_t0;
let d_t1;
let tcomp1 = "false";
let tcomp2 = "false";
let tcomp3 = "false";
let dcomp1 = "false";
let dcomp2 = "false";
let dcomp3 = "false";
let prev_algo = "nope";

class PathfindingVisualizer extends Component{
    constructor(){
        super();
        this.state={
            grid: [],
            mouseIsPressed: false,
            weight: 1,
            changeWeight: false,
            done: "none",
            t_distance: 0,
            togg: (<button onClick={()=>{this.randTraffic()}}>Randomize weights</button>),
        };
    }

    componentDidMount(){
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        let newGrid = [];
        if(this.state.changeWeight){
            newGrid = getNewGridWithWeightToggled(this.state.grid, row, col, this.state.weight);
        }
        else {
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col){
        if(!this.state.mouseIsPressed) return;

        let newGrid = [];

        if(this.state.changeWeight){
            newGrid = getNewGridWithWeightToggled(this.state.grid, row, col, this.state.weight);
        }
        else{
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseUp(){
        this.setState({mouseIsPressed: false})
    }

    animate_algo(visitedNodesInOrder,nodesInShortestPathOrder)
    {
        for(let i=1;i<=visitedNodesInOrder.length;i++)
        {
            if(i === visitedNodesInOrder.length)
            {
                setTimeout(()=>{
                    this.animateShortestPath(nodesInShortestPathOrder);
                },10 * i);
                //console.log(this.state.grid)
                return;
            }
            if(i === visitedNodesInOrder.length-1) continue;
            setTimeout(()=>{
                const node = visitedNodesInOrder[i];
                if(node.isWeight) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visitedWeight';
                }
                else{
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }
            }, 10 * i);
        } 
    }

    animateShortestPath(nodesInShortestPathOrder)
    {
        let cnt=0;
        let t_traff=0;
        for(let i=1;i<nodesInShortestPathOrder.length-1;i++)
        {
            setTimeout(()=>{
                const node = nodesInShortestPathOrder[i];
                if(nodesInShortestPathOrder[i].isWeight){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path-weight';
                }
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            },50 * i);
        }
        for(let i=1;i<nodesInShortestPathOrder.length-1;i++)
        {
            const node = nodesInShortestPathOrder[i];
            if(nodesInShortestPathOrder[i].isWeight){
                cnt++;
                t_traff+=nodesInShortestPathOrder[i].weight;
            }
        }
        console.log(nodesInShortestPathOrder.length);
        /*console.log(t_traff);
        console.log(cnt);*/
        this.setState({t_distance: nodesInShortestPathOrder.length + t_traff - cnt});
        //this.setState({done: "Dijkstras"});
    }

    weightChangeHandler = (event) => {
        this.setState({weight: event.target.value});
    };

    pointChangeHandler = () => {
        if (this.notCorrect()) return; //To check if the provided value is suitable or not.
    
        document.getElementById(
            `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = "node";
        document.getElementById(
            `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = "node";
    
        START_NODE_ROW = parseInt(document.getElementById("start_row").value);
        START_NODE_COL = parseInt(document.getElementById("start_col").value);
        FINISH_NODE_ROW = parseInt(document.getElementById("end_row").value);
        FINISH_NODE_COL = parseInt(document.getElementById("end_col").value);
    
        document.getElementById(
            `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = "node node-start";
        document.getElementById(
            `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = "node node-finish";
    };
    
    notCorrect = () => {
        if (
            isNaN(parseInt(document.getElementById("start_row").value)) ||
            isNaN(parseInt(document.getElementById("start_col").value)) ||
            isNaN(parseInt(document.getElementById("end_row").value)) ||
            isNaN(parseInt(document.getElementById("end_col").value))
        )
            return true;
        
        if (
            parseInt(document.getElementById("start_row").value) > 20 ||
            parseInt(document.getElementById("start_col").value) > 50
        )
            return true;
        if (
            parseInt(document.getElementById("start_row").value) < 0 ||
            parseInt(document.getElementById("start_col").value) < 0
        )
            return true;
        
        if (
            parseInt(document.getElementById("end_row").value) > 20 ||
            parseInt(document.getElementById("end_col").value) > 50
        )
            return true;
        if (
            parseInt(document.getElementById("end_row").value) < 0 ||
            parseInt(document.getElementById("end_col").value) < 0
        )
            return true;
        
        return false;
    };
    

    visualizeDijkstra(){
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        d_t0 = performance.now(); 
        visitedNodesInOrder = dijkstra(grid,startNode,finishNode);
        d_t1 = performance.now();
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animate_algo(visitedNodesInOrder,nodesInShortestPathOrder);
        this.setState({done: "Dijkstras"});
    }

    visualizeBFS(){
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        bfs_t0 = performance.now();
        visitedNodesInOrder = bfs(grid,startNode,finishNode);
        bfs_t1 = performance.now();
        nodesInShortestPathOrder = getNodesInShortestPathOrderbfs(finishNode);
        this.animate_algo(visitedNodesInOrder,nodesInShortestPathOrder);
        this.setState({done: "BFS"});
    }

    visualizeDFS(){
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        dfs_t0 = performance.now();
        visitedNodesInOrder = dfs(grid,startNode,finishNode);
        dfs_t1 = performance.now();
        nodesInShortestPathOrder = getNodesInShortestPathOrderdfs(finishNode);
        this.animate_algo(visitedNodesInOrder,nodesInShortestPathOrder);
        this.setState({done: "DFS"});
    }

    randWalls(){
        const{grid} = this.state;
            for(let i=0;i<160;i++)
            {
                setTimeout(()=>{
                    var ro = Math.random()*20;
                    var co = Math.random()*50;
                    let flag = 0;
                    const node = grid[Math.floor(ro)][Math.floor(co)];
                    if((node.row === START_NODE_ROW && node.col == START_NODE_COL) || (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL))
                        flag=1;
                    
                    if(!flag)
                    {
                        node.isWall = true;
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
                    }
                },50*i)
            }
    }

    randTraffic(){
        const{grid} = this.state;
            for(let i=0;i<160;i++)
            {
                setTimeout(()=>{
                    var ro = Math.random()*20;
                    var co = Math.random()*50;
                    let flag = 0;
                    const node = grid[Math.floor(ro)][Math.floor(co)];
                    if((node.row === START_NODE_ROW && node.col == START_NODE_COL) || (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL))
                        flag=1;
                    
                    if(!flag)
                    {
                        node.isWeight = true;
                        let rtraf = Math.random()*100;
                        node.weight = parseInt(rtraf);
                        //console.log(node.weight);
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-weight';
                    }
                },50*i)
            }
    }

    toggleWeight = () => {
        const temp = this.state.changeWeight;
        this.setState({changeWeight: !temp});
    };

    visualize = () => {
        var temp = document.getElementById("algo");
        var c_algo = temp.options[temp.selectedIndex].value;
        //console.log(c_algo);
        if(c_algo === "Dijkstras") this.visualizeDijkstra();
        if(c_algo === "BFS") this.visualizeBFS();
        if(c_algo === "DFS") this.visualizeDFS();
    };

    selection_func = () =>{
        var temp = document.getElementById("algo");
        var c_algo = temp.options[temp.selectedIndex].value;
        if(c_algo === "Dijkstras")  this.setState({togg:<button onClick={()=>{this.randTraffic()}}>Randomize weights</button>})
        if(c_algo === "BFS"){
            this.setState({togg:<button className="dbtn" onClick={()=>{this.randTraffic()}} disabled>Randomize weights</button>});
            const {grid} = this.state;
            for(let i=0;i<grid.length;i++)
            {
                for(let j=0;j<grid[i].length;j++)
                {
                    setTimeout(()=>{
                        const node = grid[i][j];
                        if(node.isWeight)
                        {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node ';
                            node.isWeight = false;
                            node.weight = 1;
                        }
                    }, 10)
                }
            }
        }
        if(c_algo === "DFS"){
            this.setState({togg:<button className="dbtn" onClick={()=>{this.randTraffic()}} disabled>Randomize weights</button>});
            const {grid} = this.state;
            for(let i=0;i<grid.length;i++)
            {
                for(let j=0;j<grid[i].length;j++)
                {
                    setTimeout(()=>{
                        const node = grid[i][j];
                        if(node.isWeight)
                        {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node ';
                            node.isWeight = false;
                            node.weight = 1;
                        }
                    }, 10)
                }
            }
        }
    }

    clear_path = () =>{
        const {grid} = this.state;
        /*let v_n = visitedNodesInOrder;
        let vs_n = nodesInShortestPathOrder;*/
        
        //v_n[0].isVisited = false;
        grid[START_NODE_ROW][START_NODE_COL].isVisited = false;
    
        for(let i=0;i<grid.length;i++)
        {
            for(let j=0;j<grid[i].length;j++)
            {
                if(grid[i][j].isWeight)
                {
                    document.getElementById(`node-${grid[i][j].row}-${grid[i][j].col}`).className = 'node node-weight';
                    continue;
                }
                if(grid[i][j].isWall || grid[i][j].isStart) continue;
                if(grid[i][j].isFinish){
                    grid[i][j].isVisited = false;
                    grid[i][j].distance = Infinity;
                    continue;
                }
                setTimeout(()=>{
                    const node = grid[i][j];
                    node.isVisited = false;
                    node.distance = Infinity;
                    node.previousNode = null;
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node ';
                }, 10);

            }
            /*if(i === v_n.length)
            {
                setTimeout(()=>{
                    this.clear_s_path(vs_n);
                },10);
                console.log(this.state.grid);
                return;
            }
            if(v_n[i].isWeight == true)
            {
                document.getElementById(`node-${v_n[i].row}-${v_n[i].col}`).className = 'node node-weight';
                continue;
            }
            if(i === v_n.length-1)
            {
                v_n[i].isVisited = false;
                continue;
            }
            setTimeout(()=>{
                const node = v_n[i];
                node.isVisited = false;
                node.distance = Infinity;
                node.previousNode = null;
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node ';
            }, 10);*/
        }
        {this.clear_s_path(nodesInShortestPathOrder)}
        console.log(this.state.grid);
    }

    clear_s_path = (vs_n) =>{
        for(let i=1;i<vs_n.length-1;i++)
        {
            if(vs_n[i].isWeight == true)
            {
                document.getElementById(`node-${vs_n[i].row}-${vs_n[i].col}`).className = 'node node-weight';
                continue;
            }
            setTimeout(()=>{
                const node = vs_n[i];
                node.isVisited = false;
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node ';
            }, 50);
        }
        this.setState({done: "none"});
    }

    pop_message = () => {

        prev_algo = this.state.done;
        this.setState({done: "temp1"});
    }

    p_algo = () => {
        
        this.setState({done: prev_algo});
    }
    render(){
        const {grid, mouseIsPressed} = this.state;
        let changeWeightText = "False";
        if(this.state.changeWeight) changeWeightText = "True";

        t_menu = (
            <div className = "menu">
                    <button className="tempbtn" onClick={() => window.location.reload()}><h1 className="head">Pathfinding Visualizer</h1></button>
                    <select name="algo" id="algo" className="choose" onChange={this.selection_func}>
                        <option value="none">-- Select Algorithm --</option>
                        <option value="Dijkstras">Dijkstras '('Weighted')'</option>
                        <option value="BFS">BFS '('Unweighted')'</option>
                        <option value="DFS">DFS '('Unweighted')'</option>
                    </select>
                    <button onClick={this.visualize}>
                        Visualize Algorithm
                    </button>
                    <div className="startPointContainer">
                        <label htmlFor="point">Start Point :</label>
                        <input
                            type="number"
                            name="point"
                            id="start_row"
                            min="0"
                            max={20 - 1}
                            onChange={this.pointChangeHandler}
                            defaultValue="3"
                        ></input>
                        <input
                            type="number"
                            name="point"
                            id="start_col"
                            min="0"
                            max={50 - 1}
                            onChange={this.pointChangeHandler}
                            defaultValue="5"
                        ></input>
                        </div>

                        <label htmlFor="quantity">Set Weight </label>

                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            max="100"
                            onChange={this.weightChangeHandler}
                            defaultValue="1"
                        />

                        <label htmlFor="quantity"> Toggle Weight</label>

                        <button onClick={this.toggleWeight}>{changeWeightText}</button>

                        <div className="endPointContainer">
                        <label htmlFor="point">End Point :</label>
                        <input
                            type="number"
                            name="point"
                            id="end_row"
                            min="0"
                            max={20 - 1}
                            onChange={this.pointChangeHandler}
                            defaultValue="16"
                        ></input>
                        <input
                            type="number"
                            name="point"
                            id="end_col"
                            min="0"
                            max={50 - 1}
                            onChange={this.pointChangeHandler}
                            defaultValue="45"
                        ></input>
                        </div>
                    <button onClick={()=>{this.randWalls()}}>Randomize Walls</button>
                    {this.state.togg}
                    <div className="start"><p className="legend">-Start</p></div>
                    <div className="finish"><p className="legend">-Finish</p></div>
                    <div className="l_walls"><p className="legend">-Wall</p></div>
                    <div className="l_weight"><p className="legend">-Weight</p></div>
                    <div className="v_node"><p className="legend">-Visited_Node</p></div>
                    <div className="s_path"><p className="legend">-Shortest_Path</p></div>
                </div>
        )
        
        console.log(this.state.done);
        if(this.state.done === "Dijkstras")
        {
            tcomp1 = d_t1-d_t0 + "ms";
            dcomp1 = this.state.t_distance;
            t_menu = (
                <div className = "menu">
                    <button className="btn" onClick = {()=>window.location.reload()}> Pathfinding Visualizer </button>
                    <div className="btn_all">
                        <button className = 'btn_t' onClick = {() => {this.clear_path()}}> Clear Path</button>
                        <button className = 'btn_t' onClick = {this.pop_message}> Comparison </button>
                    </div>
                    <p className = "t_distance">Total distance taken: {this.state.t_distance}. -- Time taken: {d_t1-d_t0}ms. -- Time complexity: adjacency list = '('V+E logV')' and adjacency matrix = '('V^2')'. -- Space complexity: avg = '('V+E')' and worst = '('V^2')'. </p>
                    <p className = "t_distance"> Dijkstra's algorithm is very accurate, thus giving you the guaranteed shortest path.</p>
                </div>
            )
        }
        else if(this.state.done === "BFS")
        {
            tcomp2 = bfs_t1-bfs_t0 + "ms";
            dcomp2 = this.state.t_distance;
            t_menu = (
                <div className = "menu">
                    <button className="btn" onClick = {()=>window.location.reload()}> Pathfinding Visualizer </button>
                    <div className="btn_all">
                        <button className = 'btn_t' onClick = {() => {this.clear_path()}}> Clear Path</button>
                        <button className = 'btn_t' onClick = {this.pop_message}> Comparison </button>
                    </div>
                    <p className = "t_distance">Total distance taken: {this.state.t_distance}. -- Time taken: {bfs_t1-bfs_t0}ms. -- Time complexity: adjacency list = '('V+E')' and adjacency matrix = '('V^2')'. -- Space complexity: avg = '('V+E')' and worst = '('V^2')'. </p>
                    <p className = "t_distance"> BFS algorithm is very accurate, thus giving you the guaranteed shortest path.</p>

                </div>
            )
        }

        else if(this.state.done === "DFS")
        {
            tcomp3 = dfs_t1-dfs_t0 + "ms";
            dcomp3 = this.state.t_distance;
            t_menu = (
                <div className = "menu">
                    <button className="btn" onClick = {()=>window.location.reload()}> Pathfinding Visualizer </button>
                    <div className="btn_all">
                        <button className = 'btn_t' onClick = {() => {this.clear_path()}}> Clear Path</button>
                        <button className = 'btn_t' onClick = {this.pop_message}> Comparison </button>
                    </div>
                    <p className = "t_distance">Total distance taken: {this.state.t_distance}. -- Time taken: {dfs_t1-dfs_t0}ms.-- Time complexity: adjacency list = '('V+E')' and adjacency matrix = '('V^2')'. -- Space complexity: avg = '('V+E')' and worst = '('V^2')'. </p>
                    <p className = "t_distance"> DFS algorithm is not accurate, so it may or may not provide you the shortest path.</p>

                </div>
            )
        }
        else if(this.state.done === "temp1")
        {
            t_menu = (
                <div className = "menu">
                    <div className = "in_tbl">
                        <table>
                            <tr>
                                <th>Algorithm</th>
                                <th>Distance traveled</th>
                                <th>Time taken</th>
                            </tr>
                                <tr>
                                <th>Dijkstra</th>
                                <th>{dcomp1}</th>
                                <th>{tcomp1}</th>
                            </tr>
                            <tr>
                                <th>BFS</th>
                                <th>{dcomp2}</th>
                                <th>{tcomp2}</th>
                            </tr>
                            <tr>
                                <th>DFS</th>
                                <th>{dcomp3}</th>
                                <th>{tcomp3}</th>
                            </tr>
                        </table>
                    </div>
                    <div className = "temp_d">
                        <button onClick={this.p_algo}> Previous page </button>
                    </div>
                </div>
            )
        }

        //console.log(grid);

        return(
            <>

                {t_menu}

                <div className="grid">
                    {grid.map((row,rowidx)=>{
                        return(
                            <div key={rowidx}>
                                {row.map((node,nodeidx) => {
                                    const {row, col, isWall, isStart, isFinish, isWeight} = node;
                                    return(
                                        <Node
                                            key = {nodeidx}
                                            isStart = {isStart}
                                            isFinish = {isFinish}
                                            row = {row}
                                            col = {col}
                                            isWall = {isWall}
                                            isWeight = {isWeight}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown = {(row, col)=>this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col)=> this.handleMouseEnter(row, col)}
                                            onMouseUp={()=> this.handleMouseUp()}
                                        />
                                    );
                                })}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
}

const getInitialGrid = () =>
{
    const grid = [];
    for(let row = 0;row < 20;row++)
    {
        const c_row = [];
        for(let col = 0; col < 50; col++)
            c_row.push(createNode(row, col));
        grid.push(c_row);
    }
    return grid;
}

const createNode = (row, col) =>{
    return{
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isWeight: false,
        previousNode: null,
        weight: 1,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col, weight) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWeight: !node.isWeight,
        weight: parseInt(weight),
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

export default PathfindingVisualizer;