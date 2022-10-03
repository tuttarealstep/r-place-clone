import * as amqp from 'amqplib';
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: parseInt(process.env.PORT || '7676') });
const amqpConnection = amqp.connect('amqp://' + (process.env.RABBIT_HOST || '0.0.0.0'))

const parseCommand = (message: string) => {
    try {
        const commandMessage = JSON.parse(message);

        switch (commandMessage.command) {
            //todo update options command
            case "pixel_place":
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
                break;
            default:
                //todo command not found
                break;
        }

    } catch (e) {
        //todo catch error somewhere?
        console.log(e);
    }
}

amqpConnection
    .then(conn => conn.createChannel())
    .then(channel => {
        const exchange = process.env.RABBIT_EXCHANGE || 'place';
        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }).then(() => {
            console.log(" [*] Waiting for messages");
            channel.bindQueue('', exchange, '');

            channel.consume('', (msg) => {
                if (msg !== null) {
                    parseCommand(msg.content.toString());
                    channel.ack(msg);
                }
            })
        })
    })
    .catch(function (err) {
        console.log(err);
        
        //todo check error type
        wss.close();
        process.exit(1);
    })
/*
wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
    }
});
/*
wss.on('connection', (ws: WebSocket) => {

});*/
console.log("WebSocket server started on port:", wss.options.port);
console.log(" [*] Waiting for internal messages");
console.log(" [*] Waiting for clients");
