import redis_client from '../database/redis';
import iPixel from '../interface/iPixel';

// This model save to redis

/**
 * Like reddit blog post i will use redis to store a long bitfield for the canvas.
 * 
 * https://github.com/reddit-archive/reddit-plugin-place-opensource/blob/master/reddit_place/models.py
 * 
 * Offset = x + y * canvas_width
 * 
 * In the bitfield command I use u5 as encoding (255 max value)
 * 
 * @param pixel<iPixel>
 */
const setPixel = (pixel: iPixel) => {
    const offset: number = pixel.x + (pixel.y * (parseInt(process.env.CANVAS_WIDTH || "0")));
    redis_client.sendCommand(['BITFIELD', process.env.CANVAS_NAME || "canvas", 'SET', 'u8', '#' + offset.toString(), pixel.color.toString()]);
}

/**
 * Return the map from redis
 * @returns Promise<string>
 */
const getMap = async (): Promise<Buffer> => {
    const value = await redis_client.get(redis_client.commandOptions({ returnBuffers: true }), process.env.CANVAS_NAME || "canvas");
    return value === null ? Buffer.from('') : value;
}

export {
    setPixel,
    getMap
}   