import * as amqp from 'amqplib';

const amqpConnection = amqp.connect('amqp://' + (process.env.RABBIT_HOST || '0.0.0.0'))

const sendMessage = async (message: string, queue: string = '') => {
    return amqpConnection
        .then(conn => conn.createChannel())
        .then(channel => {
            const exchange = process.env.RABBIT_EXCHANGE || 'place';
            channel.assertExchange(exchange, 'fanout', {
                durable: false
            });
            channel.publish(exchange, queue, Buffer.from(message));
        })
        .catch(function (err) {
            console.log(err);
        })
}

const sendCommand = async (command: string, payload: any, queue: string = '') => {
    return sendMessage(JSON.stringify({
        command: command,
        content: payload
    }), queue)
}

export {
    sendMessage,
    sendCommand
}