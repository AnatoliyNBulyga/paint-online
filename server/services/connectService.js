const app = require('express')();


class ConnectService {
    constructor(aWss) {
        this.aWss = aWss;
    }
    connection(ws, msg) {
        ws.id = msg.id;
        this.broadcastConnection(msg);
    }
    broadcastConnection(msg) {
        this.aWss.clients.forEach( client => {
            if (client.id === msg.id) {
                client.send(JSON.stringify(msg));
            }
        });
    }
}

module.exports = ConnectService;