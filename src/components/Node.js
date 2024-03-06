import React, {Component} from 'react';
import './Node.css';

export default class Node extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        const {isFinish,
            isStart,
            col,
            isWall,
            isWeight,
            onMouseDown,
            onMouseUp,
            onMouseEnter,
            row,  
        } = this.props;
        const extractClassName = isFinish? 'node-finish':isStart? 'node-start': isWall ? 'node-wall': isWeight ? 'node-weight': '';
        return(
        <div
            id={`node-${row}-${col}`}
            className={`node ${extractClassName}`}
            onMouseDown={() => onMouseDown(row,col)}
            onMouseEnter={()=> onMouseEnter(row, col)}
            onMouseUp = {()=> onMouseUp()}></div>)
    }
}