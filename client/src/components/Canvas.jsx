import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {WS_URL} from '../config.js';

import {Modal, Button, Form} from 'react-bootstrap';
import '../styles/canvas.scss';

import canvasState from '../store/canvasState.js';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Eraser from '../tools/Eraser';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Line from '../tools/Line';
import {getCanvas} from '../actions/file.js';

const Canvas = observer( () => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const [validated, setValidated] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        getCanvas(id);

    }, [id]);

    useEffect(() => {
        if (!canvasState.username) return false;
        const socket = new WebSocket(WS_URL);
        canvasState.setSocket(socket);
        canvasState.setSessionId(id);
        toolState.setTool(new Brush(canvasRef.current, socket, id));
        socket.onopen = () => {
            console.log('Подключение установлено')
            socket.send(JSON.stringify({
                id: id,
                username: canvasState.username,
                method: "connection"
            }));
        };
        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            switch(msg.method) {
                case "connection":
                    console.log(`Пользователь ${msg.username} присоединился`);
                    break;
                case "draw":
                    drawHandler(msg);
                    break; 
                case "settings":
                    settingsHandler(msg);
                    break;              
                default:
                    console.log(`Пользователь ${msg.username} присоединился`);        
            }
        }

    }, [modal, id]);

    const settingsHandler = (msg) => {
        console.log('settingsHandler ', msg)
    }
    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch(figure.type) {
            case 'brush':
                Brush.draw(
                    ctx, 
                    figure.x, 
                    figure.y, 
                    figure.lineWidth,
                    figure.strokeColor
                );
                break;
            case 'rect':
                Rect.staticDraw(
                    ctx, 
                    figure.x, 
                    figure.y, 
                    figure.width, 
                    figure.height, 
                    figure.fillColor,
                    figure.strokeColor,
                    figure.lineWidth
                );   
                break;
            case 'circle':
                Circle.staticDraw(
                    ctx,
                    figure.x,
                    figure.y,
                    figure.radius,
                    figure.fillColor,
                    figure.strokeColor,
                    figure.lineWidth
                )
                break;      
            case 'eraser':
                Eraser.staticDraw(
                    ctx, 
                    figure.x, 
                    figure.y, 
                    figure.lineWidth
                );
                break; 
            case 'line':
                Line.staticDraw(
                    ctx, 
                    figure.startX, 
                    figure.startY, 
                    figure.finishX,
                    figure.finishY,
                    figure.lineWidth,
                    figure.strokeColor
                );
                break;             
            case 'finish':
                ctx.beginPath();
                break;      
            default: 
                Brush.draw(ctx, figure.x, figure.y, figure.lineWidth, figure.strokeColor); 
        }
    };              
    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    };
    const connectionHandler = (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        setValidated(true);
        canvasState.setUsername(usernameRef.current.value);
        form.checkValidity() && setModal(false);
    };
    const onHideHandle = () => {
        setValidated(true);
    }

    return (
        <div className="canvas">
            <Modal className="modal" show={modal} onHide={onHideHandle}>
                <Form noValidate validated={validated} onSubmit={connectionHandler}>
                    <Modal.Header><div className="modal__title">Log in</div></Modal.Header>
                    <Modal.Body>
                        <Form.Control required type="text" onChange={() => setValidated(true)} ref={usernameRef} placeholder="Enter your name" />
                        <Form.Control.Feedback type="invalid">
                            Please enter your name
                        </Form.Control.Feedback>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Get started
                        </Button>
                    </Modal.Footer>
                </Form>    
            </Modal>
            <canvas onMouseDown={mouseDownHandler} ref={canvasRef} width={600} height={400} />
        </div>
    )
});

export default Canvas;