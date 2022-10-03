import IEngineColor from "./IEngineColor"

export default interface EngineOptions {
    canvas_width: number,
    canvas_height: number,
    colors: Array<IEngineColor>
}