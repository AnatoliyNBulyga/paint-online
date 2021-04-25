import React, {useState, useRef, useEffect} from 'react';
import toolState from '../store/toolState';
import canvasState from '../store/canvasState';
import {shareCanvas, getCanvas} from '../actions/file.js';
import {useParams} from 'react-router-dom';
import {WS_URL} from '../config.js';

import {Button} from 'react-bootstrap';

const SettingsBar = () => {
    
    const [clear, setClear] = useState(false);
    const {id} = useParams();
    const copyRef = useRef();
    const lineRef = useRef();
    const strokeColorRef = useRef();
    const fillColorRef = useRef();
    const socket = new WebSocket(WS_URL);
      
    useEffect(() => {
        getCanvas(id)
            .then(response => {
                const ctx = canvasState.canvas.getContext('2d');
                lineRef.current.value = ctx.lineWidth;
                strokeColorRef.current.value = ctx.strokeStyle;
                fillColorRef.current.value = ctx.fillStyle;
            });

    }, [id]);

    // useEffect(() => {
    //     socket.onmessage = (event) => {
    //         let msg = JSON.parse(event.data);
    //         switch(msg.method) {
                
    //             case "settings":
    //                 settingsHandler(msg);
    //                 break;              
                      
    //         }
    //     }
    // }, []);

    const settingsHandler = (msg) => {
        console.log('settingsHandler ', msg)
    }

    const onShareHandler = id => {
        window.confirm('Are you sure') && shareCanvas(id);
        /* copy link to the buffer */
        const button = copyRef.current;

        const link = window.location;
        const el = document.createElement('textarea');
        el.value = link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        const buttonText = button.innerText;
        button.innerText = 'Copied';
        button.setAttribute('disabled', true);
        if (clear) {
            clearInterval(clear);
        }
        setClear(setTimeout(() => {
            button.innerText = buttonText;
            button.removeAttribute('disabled');
        }, 1500));   
    }
    const lineHandler = (e) => {
        toolState.setLineWidth(e.target.value);
        socket.send(JSON.stringify({
            id: id,
            method: "settings",
            type: 'lineWidth',
            value: e.target.value
        }));
    }
    return (
        <div className="toolbar toolbar-settings">
            <div className="toolbar-settings__left">
                <div className="toolbar-settings__group">
                    <label htmlFor="line-width">Толщина обводки</label>
                    <input 
                        ref={lineRef}
                        onChange={ e => lineHandler(e)}
                        type="number" 
                        id="line-width"
                        value={toolState.lineWidth}
                        min={1} max={50}/>
                </div>
                <div className="toolbar-settings__group">
                    <label htmlFor="stroke-color">Цвет обводки</label>
                    <input 
                        ref={strokeColorRef}
                        onChange={ e => toolState.setStrokeColor(e.target.value)}
                        type="color" 
                        id="stroke-color"/> 
                </div>
                <div className="toolbar-settings__group">
                    <label htmlFor="stroke-color">Цвет заливки</label>
                    <input 
                        ref={fillColorRef}
                        onChange={ e => toolState.setFillColor(e.target.value)}
                        type="color" 
                        id="stroke-color"/>
                </div>
            </div>
            <div className="toolbar-settings__right">    
                <Button ref={copyRef} variant="primary" size="sm" className="toolbar-settings__btn toolbar__share-btn" onClick={() => onShareHandler(id)}>Share canvas</Button>           
            </div>
        </div>
    )
}

export default SettingsBar;