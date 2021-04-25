const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const ConnectService = require('./services/connectService.js');
const connectService = new ConnectService(aWss);
const fileRouter = require('./routes/fileRouter.js');

app.use(cors());
app.use(express.json());
app.use('/api', fileRouter);

app.ws('/', (ws, req) => {
    console.log('Connection is established');
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case 'connection':
                connectService.connection(ws, msg);
                break;
            case 'draw':
                connectService.broadcastConnection(msg);
                break;  
            case 'settings':
                connectService.broadcastConnection(msg);
                break;     
            default: 
                connectService.connection(ws, msg);
                break;    
        }
    });
});

app.listen(PORT, () => console.log(`Server run on port ${PORT}`));