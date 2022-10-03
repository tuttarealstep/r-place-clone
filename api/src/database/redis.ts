import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://0.0.0.0:6379',
});
client.on('error', (err) => console.log('Redis error', err))
client.connect()

export default client