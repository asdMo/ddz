/**
 * 
 */
const ws = require('WebSocket');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.registrationAndCancellationEvent(true);
        ws.init();
    },

    onDestroy() {
        this.registrationAndCancellationEvent(false);
    },

    registrationAndCancellationEvent(flag) {
        let eventName = flag ? 'on' : 'off';
        pp.customEvent[eventName]('netOpen', this.callNetOpen, this);
    },

    callNetOpen(event) {
        
    },
});
