import Brush from './Brush.js';

export default class Eraser extends Brush {

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }));
        }
    }
    draw(x,y) {
        this.strokeColor = "white";
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.strokeColor = this.startStrokeColor;
    }
    static staticDraw(ctx, x, y, lineWidth) {
        const startStrokeStyle = ctx.strokeStyle;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.strokeStyle = startStrokeStyle;
    }
}