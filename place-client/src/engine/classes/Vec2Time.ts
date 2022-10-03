import Vec2 from "./Vec2";

export default class Vec2Time {
    x: number;
    y: number;
    t: number;
    constructor(x: number, y: number, t: number) {
        this.x = x;
        this.y = y;
        this.t = t;
    }

    set({ x, y, t }: { x: number, y: number, t: number }) {
        this.x = x;
        this.y = y;
        this.t = t;
    }

    clone() {
        return new Vec2Time(this.x, this.y, this.t);
    }

    multiply(scalar: number) {
        return new Vec2Time(this.x * scalar, this.y * scalar, this.t);
    }

    toVec2() {
        return new Vec2(this.x, this.y);
    }
}