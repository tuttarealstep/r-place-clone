import { Component, Ref } from "vue";
import Camera from "./classes/Camera";
import World from "./classes/World";
import WorldConnection from "./classes/WorldConnection";
import IEngineColor from "./interfaces/IEngineColor";
import EngineOptions from "./interfaces/IEngineOptions";

class Engine {
    options: EngineOptions;
    world: World;
    camera: Camera;
    worldConnection: WorldConnection;
    elements: {
        camera: HTMLDivElement | undefined;
        positionContainer: HTMLDivElement | undefined;
        zoomContainer: HTMLDivElement | undefined;
        pixel: HTMLDivElement | undefined;
        canvas: HTMLCanvasElement | undefined;
        coordinates: {
            x: number;
            y: number;
            zoom: number;
            zoomText: string;
        } | undefined;
        selectedColor: IEngineColor | undefined;
    };

    constructor() {
        this.options = {
            canvas_width: 0,
            canvas_height: 0,
            colors: []
        };

        this.world = new World(this);
        this.camera = new Camera(this);

        this.elements = {
            camera: undefined,
            positionContainer: undefined,
            zoomContainer: undefined,
            pixel: undefined,
            canvas: undefined,
            coordinates: undefined,
            selectedColor: undefined
        }

        this.worldConnection = new WorldConnection(this);
    }

    private async loadOptions() {
        this.options = await fetch((import.meta.env.VITE_API_URL || "http://0.0.0.0:3001") + "/api/place/options").then(data => data.json())
    }

    private loadElements() {
        this.elements.camera = <HTMLDivElement>document.querySelector(".camera")!;
        this.elements.positionContainer = <HTMLDivElement>document.querySelector(".position-container")!;
        this.elements.zoomContainer = <HTMLDivElement>document.querySelector(".zoom-container")!;
        this.elements.pixel = <HTMLDivElement>document.querySelector(".pixel")!;
        this.elements.canvas = <HTMLCanvasElement>document.getElementById("map")!;
    }

    async init() {
        this.loadElements();
        await this.loadOptions();
        await this.world.init();
        this.camera.init();
        this.worldConnection.init();
    }
}

export default Engine;