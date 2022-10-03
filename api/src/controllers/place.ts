import { Request, Response } from "express";
import validator from "validator";
import iPixel from "../interface/iPixel";
import * as Pixel from "../models/pixel";
import * as RedisCanvas from "../models/redisCanvas";
import { getAvaiableColorsAssociation, isColorAvaiable } from "../utils/colors";
import * as WebSocket from "../utils/websocket"

const draw = (req: Request, res: Response) => {
    //todo Check is user exists

    if (req.body.x === undefined || req.body.y === undefined || req.body.color === undefined) {
        res.status(403).end();
        return;
    }

    if (!validator.isInt(req.body.x.toString(), { min: 0, max: parseInt(process.env.CANVAS_WIDTH || "0") })) {
        res.status(403).end();
        return;
    }

    if (!validator.isInt(req.body.y.toString(), { min: 0, max: parseInt(process.env.CANVAS_HEIGHT || "0") })) {
        res.status(403).end();
        return;
    }

    //8bit color (0-255)
    if (!validator.isInt(req.body.color.toString(), { min: 0, max: 255 })) {
        res.status(403).end();
        return;
    }

    //Check if color is avaiable
    if (!isColorAvaiable(parseInt(req.body.color))) {
        res.status(403).end();
        return;
    }

    //todo check if user admin and his waiting time

    const pixel: iPixel = {
        x: parseInt(req.body.x),
        y: parseInt(req.body.y),
        color: parseInt(req.body.color)
    };

    Pixel.setPixel(pixel);

    //todo set user last pixel place time 

    //todo send to a queue?
    WebSocket.sendCommand(
        "pixel_place",
        {
            x: pixel.x,
            y: pixel.y,
            color: pixel.color,
        },
    );

    //todo user cooldown const cooldown = parseInt(process.env.COOLDOWN || "300"); //todo if is admin cooldown = 0

    /* res.json({
         'ok': cooldown,
         //cooldown
     });*/

    res.end();
}

const map = async (req: Request, res: Response) => {
    //todo cache control
    const map = await RedisCanvas.getMap();
    res.send(map);
}

const options = (req: Request, res: Response) => {
    res.json({
        canvas_width: parseInt(process.env.CANVAS_WIDTH || "0"),
        canvas_height: parseInt(process.env.CANVAS_HEIGHT || "0"),
        colors: getAvaiableColorsAssociation()
    });
}

export {
    draw,
    map,
    options
}