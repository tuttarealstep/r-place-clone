import Engine from "../Engine";
import Sound from "./Sound";
import Utils from "./Utils";

export default class World {
    engine: Engine;
    canvasCtx: CanvasRenderingContext2D | undefined;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    async init() {
        this.setUpCanvas();
        await this.loadMap();
    }

    private setUpCanvas() {
        this.canvasCtx = this.engine.elements.canvas!.getContext("2d")!;

        this.canvasCtx.imageSmoothingEnabled = false;
        this.canvasCtx.canvas.width = this.engine.options.canvas_width;
        this.canvasCtx.canvas.height = this.engine.options.canvas_height;
    }

    async loadMap() {
        await fetch((import.meta.env.VITE_API_URL || "http://0.0.0.0:3001") + "/api/place/map").then(data => data.arrayBuffer()).then(data => {

            data = new Uint8Array(data);
            let rgbMap = new Uint8ClampedArray(this.engine.options.canvas_width * this.engine.options.canvas_height * 4);

            let index = 0;
            for (let i = 0; i < data.byteLength; i++) {
                let color = (this.engine.options.colors.find(e => e.id == (data as Uint8Array)[i])!).hex
                rgbMap[index] = color.r;
                rgbMap[index + 1] = color.g;
                rgbMap[index + 2] = color.b;
                rgbMap[index + 3] = 255;
                index += 4;
            }

            this.setImageData(new ImageData(rgbMap, this.engine.options.canvas_width, this.engine.options.canvas_height), 0, 0);
        });
    }

    setImageData(imageData: ImageData, x: number, y: number) {
        this.canvasCtx!.putImageData(imageData, x, y);
    }

    setPixel(x: number, y: number, color: number) {
        const pixel = new Uint8ClampedArray(4);
        const _color = (this.engine.options.colors.find(e => e.id == color)!).hex

        pixel[0] = _color.r;
        pixel[1] = _color.g;
        pixel[2] = _color.b;
        pixel[3] = 255;

        this.canvasCtx!.putImageData(new ImageData(pixel, 1, 1), x, y);
    }

    drawColorRequest(x: number, y: number, color: number) {
        //todo check user?
        fetch((import.meta.env.VITE_API_URL || "http://0.0.0.0:3001") + "/api/place/draw", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                x: x,
                y: y,
                color: color
            })
        })
        .then(data => {
            if(data.status != 200) {
                Sound.invalid();
            }
        })
        .catch(e => {
            Sound.invalid();
        })
    }


}