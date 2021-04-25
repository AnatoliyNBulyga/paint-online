import React from 'react';
import '../styles/toolbar.scss';
import {observer} from 'mobx-react-lite';
import toolState from '../store/toolState.js';
import Brush from '../tools/Brush';
import canvasState from '../store/canvasState.js';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';

const Toolbar = observer( () => {

    const downloadHandler = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        console.log(dataUrl)
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = canvasState.sessionId + "_" + Date.now() + ".jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    return (
        <div className="toolbar">
            <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <div className="toolbar__right">
                <button className="toolbar__btn undo" onClick={() => canvasState.undo()}></button>
                <button className="toolbar__btn redo" onClick={() => canvasState.redo()}></button>
                <button className="toolbar__btn save" onClick={downloadHandler}></button>   
            </div>
            
        </div>
    )
});

export default Toolbar;