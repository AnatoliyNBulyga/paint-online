import React, {useState, useRef, useEffect} from 'react';
import toolState from '../store/toolState';
import canvasState from '../store/canvasState';
import {shareCanvas, getCanvas, clearDir} from '../actions/file.js';
import {useParams} from 'react-router-dom';
import {WS_URL} from '../config.js';
import {observer} from 'mobx-react-lite';

import {Button} from 'react-bootstrap';

const SettingsBar = observer(({lineRef, strokeColorRef, fillColorRef}) => {
    
    const [clear, setClear] = useState(false);
    const {id} = useParams();
    const copyRef = useRef();
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
    const socketSettingsSend = (event, type) => {
        socket.send(JSON.stringify({
            id,
            method: 'settings',
            type,
            value: event.target.value
        }));
    }
    const lineHandler = e => {
        toolState.setLineWidth(e.target.value);
        socketSettingsSend(e, 'lineWidth');
    }
    const strokeHandler = e => {
        toolState.setStrokeColor(e.target.value);
        socketSettingsSend(e, 'strokeColor');
    }
    const fillHandler = e => {
        toolState.setFillColor(e.target.value);
        socketSettingsSend(e, 'fillColor');
    }
    const onClearDirHandler = () => {
        window.confirm('Are you sure') && clearDir();;
    }
    return (
        <div className="toolbar toolbar-settings">
            <div className="toolbar-settings__left">
                <div className="toolbar-settings__group">
                    <label htmlFor="line-width">Line width</label>
                    <input 
                        ref={lineRef}
                        onChange={ e => lineHandler(e)}
                        type="number" 
                        id="line-width"
                        defaultValue="1"
                        min={1} max={50}/>
                </div>
                <div className="toolbar-settings__group">
                    <label htmlFor="stroke-color">Stroke color</label>
                    <input 
                        ref={strokeColorRef}
                        onChange={ e => strokeHandler(e)}
                        type="color" 
                        id="stroke-color"/> 
                </div>
                <div className="toolbar-settings__group">
                    <label htmlFor="stroke-color">Fill color</label>
                    <input 
                        ref={fillColorRef}
                        onChange={ e => fillHandler(e)}
                        type="color" 
                        id="stroke-color"/>
                </div>
            </div>
            <div className="toolbar-settings__right">    
                <Button ref={copyRef} variant="primary" size="sm" className="toolbar-settings__btn toolbar__share-btn" onClick={() => onShareHandler(id)}>Share canvas</Button>           
                <Button variant="danger" size="sm" className="toolbar-settings__btn toolbar__share-btn" onClick={onClearDirHandler}>Clear images</Button>           
            </div>
        </div>
    )
});

export default SettingsBar;