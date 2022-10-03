import { types as CassandraTypes } from 'cassandra-driver';
import CassandraClient from "../database/cassandra";
import iPixel from "../interface/iPixel";

// This model save to cassandra

const setPixel = (pixel: iPixel) => {
    const query = `INSERT INTO ${process.env.CASSANDRA_KEYSPACE || 'place'}.canvas (name, x, y, color, last_update) VALUES (?, ?, ?, ?,?)`;
    CassandraClient.execute(query, [process.env.CANVAS_NAME || 'canvas', pixel.x, pixel.y, pixel.color, Date.now()], { prepare: true, consistency: CassandraTypes.consistencies.quorum });

    //todo catch errors?
}

const getPixelAt = (x: number, y: number): iPixel | null => {
    //todo get pixel from cassandra
    /* return {
       x: x,
        y: y,
        color: 0
    } as iPixel*/
    throw new Error("Method not implemented.");
}

export {
    setPixel,
    getPixelAt
}