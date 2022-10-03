import dotenv from 'dotenv';
dotenv.config();

import { types as CassandraTypes } from 'cassandra-driver';
import CassandraClient from "./database/cassandra";
import * as RedisCanvas from "./models/redisCanvas";
import iPixel from "./interface/iPixel";

const query = `SELECT * FROM ${process.env.CASSANDRA_KEYSPACE || 'place'}.canvas`;
CassandraClient.execute(query, [], { prepare: true, consistency: CassandraTypes.consistencies.quorum }).then(
    result => {
        for(let row of result.rows)
        {
            console.log(row)
            RedisCanvas.setPixel({
                x: row.x,
                y: row.y,
                color: row.color
            } as iPixel)
        }
    }
);
