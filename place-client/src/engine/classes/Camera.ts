import Engine from "../Engine";
import Utils from "./Utils";
import Vec2 from "./Vec2";
import Vec2Time from "./Vec2Time";
import anime from 'animejs';
import Sound from "./Sound";

export default class Camera {
    engine: Engine;
    zoom: number;
    coord: any;
    rect: { top: number; left: number; right: number; bottom: number; width: number; height: number; };
    boundaries: Vec2;
    isDragging: boolean;
    lastMouseDown: any;
    clickDistance: number;

    static ZOOM_MIN = 0.1;
    static ZOOM_MAX = 50;
    lastTouch: Vec2Time;
    firstTouch: Vec2Time;
    lastPinchTimestamp: number;
    prevVectorDiff: number;
    isPinching: boolean;

    constructor(engine: Engine) {
        this.engine = engine;

        this.zoom = 1;
        this.coord = new Vec2(0, 0);

        this.rect = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
        }

        this.boundaries = new Vec2(0, 0);
        this.isDragging = false;
        this.lastMouseDown = new Vec2Time(0, 0, 0);
        this.clickDistance = 0;

        this.firstTouch = new Vec2Time(0, 0, 0);
        this.lastTouch = new Vec2Time(0, 0, 0);
        this.lastPinchTimestamp = 0;
        this.prevVectorDiff = 0;
        this.isPinching = false;
    }

    init() {
        this.updateRect();
        this.updateBoundaries();
        this.setPosition();
        this.engine.elements.camera!.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.engine.elements.camera!.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.engine.elements.camera!.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.engine.elements.camera!.addEventListener("wheel", this.onWheel.bind(this));
        this.engine.elements.camera!.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.engine.elements.camera!.addEventListener("touchmove", this.onTouchMove.bind(this));
        this.engine.elements.camera!.addEventListener("touchend", this.onTouchEnd.bind(this));
        this.engine.elements.camera!.addEventListener("touchcancel", this.onTouchEnd.bind(this));

    }

    get zoomSpeed() {
        return (3 * Camera.ZOOM_MAX) / this.zoom;
    }

    get left() {
        return this.coord.x - this.boundaries.x / this.zoom;
    }

    get top() {
        return this.coord.y - this.boundaries.y / this.zoom;
    }

    onMouseDown(e: MouseEvent) {
        this.isDragging = true;
        this.clickDistance = 0;
        this.lastMouseDown.set({ x: e.clientX, y: e.clientY, t: Date.now() });
    }

    onMouseMove(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (this.isDragging && (e.movementX || e.movementY) && "number" == typeof e.movementX && "number" == typeof e.movementY) {
            this.moveBy(new Vec2(e.movementX, e.movementY));
            this.clickDistance += Vec2.distance(new Vec2(0, 0), new Vec2(e.movementX, e.movementY));
        }
    }

    onMouseUp(e: MouseEvent) {
        this.isDragging = false;


        // Check if the click was a drag or a click
        // If the lastMouseDown time is bigger than 0 this mean that we are dragging
        // If we are dragging we have the distance from the lastMouseDown to the current mouseUp that is more or equal 5 or the current time - the lastMouseDown time is >= 300ms

        if (this.lastMouseDown.t > 0) {
            if (Vec2.distance(this.lastMouseDown.toVec2(), new Vec2(e.clientX, e.clientY)) >= 5 || Date.now() - this.lastMouseDown.t >= 300) {
                return;
            }
        }

        // Here i check the distance from the last mouseDown if it is bigger than 5 we are dragging
        if (this.clickDistance >= 5) {
            return;
        }

        //If the code is here we are clicking

        //Get the clicked cell
        let clickedPixel = this.viewportToMapCoord(new Vec2(e.clientX, e.clientY))

        this.moveWithAnimation(clickedPixel)
    }

    onWheel(e: WheelEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.zoomAt(-e.deltaY / this.zoomSpeed, this.viewportToCameraCoord(new Vec2(e.clientX, e.clientY)));
    }

    onTouchStart(e: TouchEvent) {
        this.clickDistance = 0;

        if (e.targetTouches.length == 1) {
            const touchItem = e.targetTouches.item(0);
            this.isDragging = true;
            this.firstTouch = this.lastTouch = new Vec2Time(touchItem?.clientX || 0, touchItem?.clientY || 0, Date.now());
        } else if (e.targetTouches.length == 2) {

            const touchItem1 = e.targetTouches.item(0);
            const touchItem2 = e.targetTouches.item(1);

            if (!touchItem1 || !touchItem2) {
                return;
            }

            this.isDragging = true;
            this.firstTouch = new Vec2Time((touchItem1.clientX + touchItem2.clientX) / 2, (touchItem1.clientY + touchItem2.clientY) / 2, Date.now());
        }
    }

    onTouchMove(e: TouchEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (e.targetTouches.length == 1) {
            const touchItem = e.targetTouches.item(0);

            if (touchItem) {
                let checkPinch = Date.now() - this.lastPinchTimestamp >= 300;

                if (this.isDragging && checkPinch) {

                    const moveX = touchItem.clientX - (this.lastTouch.x || this.lastMouseDown.x);
                    const moveY = touchItem.clientY - (this.lastTouch.y || this.lastMouseDown.y);

                    if (moveX || moveY) {
                        this.moveBy(new Vec2(moveX, moveY));
                    }

                    this.clickDistance += Vec2.distance(new Vec2(0, 0), new Vec2(moveX, moveY));
                    this.lastTouch = new Vec2Time(touchItem.clientX, touchItem.clientY, Date.now());
                }

            }
        } else if (e.targetTouches.length == 2) {
            const touch1 = e.targetTouches[0];
            const touch2 = e.targetTouches[1];

            if (touch1 && touch2) {
                const touchDistance = Vec2.distance(new Vec2(touch1.clientX, touch1.clientY), new Vec2(touch2.clientX, touch2.clientY));
                const destX = (touch1.clientX + touch2.clientX) / 2;
                const destY = (touch1.clientY + touch2.clientY) / 2;

                if (this.prevVectorDiff !== touchDistance) {
                    this.isPinching = true;
                    this.zoomAt((touchDistance - this.prevVectorDiff) / this.zoomSpeed, new Vec2(destX, destY));
                }

                if (this.isDragging) {
                    this.moveBy(new Vec2(destX - (this.lastTouch.x || this.lastMouseDown.x), destY - (this.lastTouch.y || this.lastMouseDown.y)));
                    this.clickDistance += Vec2.distance(new Vec2(0, 0), new Vec2(destX - (this.lastTouch.x || this.lastMouseDown.x), destY - (this.lastTouch.y || this.lastMouseDown.y)));
                    this.lastTouch = new Vec2Time(destX, destY, Date.now());
                }

                this.prevVectorDiff = touchDistance;
            }
        }
    }

    onTouchEnd(e: TouchEvent) {
        this.isDragging = false;
        this.prevVectorDiff = 0;

        if (this.isPinching) {
            this.isPinching = false;
            this.lastPinchTimestamp = Date.now();
        }
    }

    updateRect() {
        this.rect = this.engine.elements.camera!.getBoundingClientRect();
    }

    updateBoundaries() {
        this.boundaries.x = (this.rect.width - this.zoom) / 2;
        this.boundaries.y = (this.rect.height - this.zoom) / 2;
    }

    setPosition({ x: x = this.coord.x, y: y = this.coord.y, zoom: zoom = this.zoom } = {}) {
        this.zoom = Math.max(Math.min(zoom, Camera.ZOOM_MAX), Camera.ZOOM_MIN);
        this.updateBoundaries()
        this.coord.x = Math.max(0, Math.min(x, this.engine.options.canvas_width - 1))
        this.coord.y = Math.max(0, Math.min(y, this.engine.options.canvas_height - 1))
        this.renderPosition()
    }

    renderPosition() {
        if (this.engine.elements.zoomContainer) {
            const zoomValue = this.zoom / Camera.ZOOM_MAX;
            //@ts-ignore
            Utils.isIOS || Utils.isSafari ? this.engine.elements.zoomContainer.style.zoom = zoomValue :
                this.engine.elements.zoomContainer.style.transform = `scale(${zoomValue})`;
        }

        this.engine.elements.positionContainer!.style.transform = `translateX(${-(this.coord.x * this.zoom - this.boundaries.x)}px) translateY(${-(this.coord.y * this.zoom - this.boundaries.y)}px)`;
        this.engine.elements.pixel!.style.transform = `translateX(${(parseInt(this.coord.x)) * Camera.ZOOM_MAX}px) translateY(${parseInt(this.coord.y) * Camera.ZOOM_MAX}px)`;

        const currentPixel = this.getSelectedPixel();

        this.engine.elements.coordinates!.x = currentPixel.x;
        this.engine.elements.coordinates!.y = currentPixel.y;
        this.engine.elements.coordinates!.zoom = this.zoom;
        this.engine.elements.coordinates!.zoomText = this.zoomToText();

        //Color pixel
        this.engine.elements.pixel!.style.backgroundColor = this.engine.elements.selectedColor?.value || "transparent"
    }

    zoomToText() {
        return (this.zoom / 10).toFixed(this.zoom >= 1 ? 1 : 2).replace(/\.0$/, "")
    }

    moveBy(destCoord: Vec2) {
        this.setPosition({
            x: this.coord.x - destCoord.x * (1 / this.zoom * 1),
            y: this.coord.y - destCoord.y * (1 / this.zoom * 1)
        })
    }

    zoomAt(zoom: number, coord: Vec2) {
        const destCoord = new Vec2(
            ((this.rect.left + this.rect.right) / 2) - coord.x,
            ((this.rect.top + this.rect.bottom) / 2) - coord.y
        );

        this.moveBy(destCoord);
        this.setPosition({ zoom: Math.max(Math.min(this.zoom + zoom, Camera.ZOOM_MAX), Camera.ZOOM_MIN) });
        this.moveBy(destCoord.multiply(-1));
    }

    moveTo(destCoord: Vec2, zoom: number) {
        this.setPosition({
            x: destCoord.x,
            y: destCoord.y,
            zoom: zoom
        })
    }

    /**
     * Viewport coordinates to camera coordinates
     */
    viewportToCameraCoord(coord: Vec2) {
        const tmpRect = this.engine.elements.camera!.getBoundingClientRect();

        return new Vec2(
            coord.x - tmpRect.left,
            coord.y - tmpRect.top
        );
    }

    /**
     * Viewport coordinates to map coordinates
     * 
     * @param Vec2 coord
     * @returns Vec2
     */
    viewportToMapCoord(coord: Vec2) {
        const cameraCoord = this.viewportToCameraCoord(coord)

        return new Vec2(
            Math.floor(this.left + cameraCoord.x / this.zoom),
            Math.floor(this.top + cameraCoord.y / this.zoom)
        );
    }

    getSelectedPixel() {
        return new Vec2(
            Math.floor(this.coord.x),
            Math.floor(this.coord.y)
        )
    }

    moveWithAnimation(destCoord: Vec2) {
        let pointsToDestination = Utils.coordBetweenPoint(this.getSelectedPixel(), destCoord)
        if (pointsToDestination.length <= 0)
            return;


        anime({
            targets: this.getSelectedPixel(),
            round: 1,
            ease: 'ease',
            duration: 300,
            update: (anim) => {
                this.moveTo(pointsToDestination[Math.floor(anim.progress / 100 * (pointsToDestination.length - 1))], this.zoom)
            },
            begin: () => {
                this.engine.elements.positionContainer!.classList.add("animate")
                Sound.highlight()
            },
            complete: () => {
                setTimeout(() => {
                    this.engine.elements.positionContainer!.classList.remove("animate")

                    if (this.zoom < 20) {
                        this.zoomWithAnimation(20)
                    }
                }, 200)
            }
        })
    }

    zoomWithAnimation(destZoom: number) {
        let currentZoom = this.zoom;

        anime({
            targets: this.getSelectedPixel(),
            round: 1,
            ease: 'ease',
            duration: 300,
            update: (anim) => {
                this.engine.camera.zoom = Math.floor(anim.progress / 100 * (destZoom - currentZoom)) + currentZoom
                this.engine.camera.renderPosition()
            },
        })
    }
}