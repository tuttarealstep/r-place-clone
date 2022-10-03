import Engine from "../Engine";

export default class WorldConnection {
    engine: Engine;
    socket: WebSocket;

    constructor(engine: Engine) {
        this.engine = engine;

        this.socket = new WebSocket('ws://' + (import.meta.env.VITE_WEBSOCKET_URL || '0.0.0.0:30000'));
    }

    init() {
        this.addEvents();
    }

    addEvents() {
        this.socket.addEventListener('message', (event) => {
            this.parseCommand(event.data);
        });
    }

    parseCommand(message: string) {
        try {
            const commandMessage = JSON.parse(message);

            switch (commandMessage.command) {
                //todo update options command
                case "pixel_place":
                    this.engine.world.setPixel(commandMessage.content.x, commandMessage.content.y, commandMessage.content.color);
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
}