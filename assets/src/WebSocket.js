let ws = {
    _TAG: 'websocket client ',
    _hostList: [
        'ws://192.168.1.3:8182',
        'ws://106.14.203.102:8182',
    ],
    _hostIndex: 0,

    socket: null,
    isInit: false,

    init() {
        if (this.isInit) {
            cc.log(this._TAG + '已连接上 ==>' + this._hostList[this._hostIndex]);
            return;
        }
        if (this._hostIndex >= this._hostList.length) {
            this._hostIndex = 0;
        }
        cc.log(this._TAG + '正在连接<' + this._hostList[this._hostIndex] + '>');
        this.socket = new WebSocket(this._hostList[this._hostIndex]);
        this.socket.onopen = this._onOpen.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        this.socket.onerror = this._onError.bind(this);
        this.socket.onmessage = this._onMessage.bind(this);
    },

    _onOpen(event) {
        cc.log(this._TAG + '==> 连接上<' + this._hostList[this._hostIndex] + '>');
        this._hostIndex = 0;
        this.isInit = true;
        pp.customEvent.emit('netOpen');
    },

    _onClose(event) {
        this.isInit = false;
        // pp.customEvent.emit("netClose");
        cc.log(this._TAG + 'onClose 3秒后重连...');
        setTimeout(() => {
            this.init();
        }, 3000);
    },

    _onError(event) {
        cc.log(this._TAG + 'onError');
        this._hostIndex++;
        // pp.customEvent.emit('netError');
    },

    _onMessage(event) {
        let msg = JSON.parse(event.data);
        if (msg) {
            pp.customEvent.emit("netMessage", msg);
        }
    },

    send(msg) {
        if (!this.isInit) {
            cc.log(this._TAG + '没有连接网络');
        } else if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(JSON.stringify(msg));
        } else {
            cc.log(this._TAG + 'readyState:' + this.socket.readyState)
        };
    },

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    },
};
window.ws = ws;
