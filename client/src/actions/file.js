import axios from 'axios';
import canvasState from '../store/canvasState.js';
import {API_URL} from '../config.js';

/* share canvas to another user */
export async function shareCanvas(id) {
    const ctx = canvasState.canvas.getContext('2d');
    const response = await axios.post(`${API_URL}api/image?id=${id}`, {
        img: canvasState.canvas.toDataURL(),
        lineWidth: ctx.lineWidth,
        strokeColor: ctx.strokeStyle,
        fillColor: ctx.fillStyle
    });
    console.log(response.data);
}

export async function getCanvas(id) {
    const response = await axios.get(`${API_URL}api/image?id=${id}`);
    const img = new Image();
    img.src = response.data.img;
    const ctx = canvasState.canvas.getContext('2d');
    ctx.lineWidth = response.data.lineWidth;
    ctx.strokeStyle = response.data.strokeColor;
    ctx.fillStyle = response.data.fillColor;
    img.onload = () => {
        const canvas = canvasState.canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.stroke();
    }
    return response.data;
}