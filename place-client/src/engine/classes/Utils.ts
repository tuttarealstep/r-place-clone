import Vec2 from "./Vec2";

export default class Utils {
    static coordBetweenPoint(startPoint: Vec2, endPoint: Vec2): Array<Vec2> {
        let points: Array<Vec2> = [];

        let x1: number = startPoint.x;
        let y1: number = startPoint.y;
        let x2: number = endPoint.x;
        let y2: number = endPoint.y;

        let dx: number = Math.abs(x2 - x1);
        let dy: number = Math.abs(y2 - y1);
        let sx: number = (x1 < x2) ? 1 : -1;
        let sy: number = (y1 < y2) ? 1 : -1;
        let err: number = dx - dy;

        points.push(new Vec2(x1, y1));

        while (!((x1 == x2) && (y1 == y2))) {
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
            points.push(new Vec2(x1, y1));
        }

        return points;
    }

    static isSafari = (window.navigator.userAgent.indexOf('Safari') > -1 && window.navigator.userAgent.indexOf('Chrome') === -1);

    static isIOS = (window.navigator.userAgent.indexOf('iOS') > -1 ||
        window.navigator.userAgent.indexOf('iPhone') > -1 ||
        window.navigator.userAgent.indexOf('iPad') > -1);
}