'use strict';

const webSocket = require('ws');
const wss_helper = require('./wss_helper');
const _TAG = 'WebSocket server ';
let clientNum = 0;

function start() {
    console.log('ws start');
    let server = new webSocket.Server({ port: 8182 });
    server.on('connection', function (ws) {
        clientNum++;
        console.log('connected ==> ' + clientNum);
        ws.on('open', function () { });
        ws.on('close', function () { clientNum--; console.log('close ==> ' + clientNum); });
        ws.on('error', function () { clientNum--; });
        ws.on('message', function (data) {
            let msg = JSON.parse(data);
            wss_helper[msg.f].call(this, msg);
            // try {
            //     wss_helper[msg.f].call(this, msg);
            // } catch (error) {
            //     this.send(JSON.stringify(`${_TAG}not <${msg.f}> function`));
            // }
        }.bind(ws));
    });
    // console.log(server);
    // wss_helper.broadcastMessage();
}
start();
