import { makeAutoObservable } from "mobx";

class ToolState {
    tool = null;
    lineWidth = 1;
    constructor() {
        makeAutoObservable(this);
    }
    setTool(tool) {
        this.tool = tool;
    }
    setFillColor(color) {
        this.tool.fillColor = color;
    }
    setStrokeColor(color) {
        this.tool.strokeColor = color;
    }
    setLineWidth(width) {
        this.lineWidth = width;
    }
}

export default new ToolState();