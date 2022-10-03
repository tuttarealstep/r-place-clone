export default class Vec2 {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    set({ x, y }: { x: number, y: number }) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    multiply(scalar: number) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    static distance(a: Vec2, b: Vec2) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow((a.y - b.y), 2));
    }
}