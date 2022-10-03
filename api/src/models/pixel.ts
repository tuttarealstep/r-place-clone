import iPixel from '../interface/iPixel';
import * as redisCanvas from './redisCanvas'
import * as canvas from './canvas'

const setPixel = (pixel: iPixel) => {
    canvas.setPixel(pixel);
    redisCanvas.setPixel(pixel);
}

export {
    setPixel
}