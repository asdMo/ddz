/**
 * 全局变量pp
 */
let pp = {
    customEvent: new cc.EventTarget(),

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    getRandomFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    },

    getRandomInt2(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min) * (Math.random() > 0.5 ? 1 : -1);
    },

    getRandomFloat2(min, max) {
        return (Math.random() * (max - min + 1) + min) * (Math.random() > 0.5 ? 1 : -1);
    },

    netMessage(event) {
        let msg = event.detail;
        if (typeof msg !== 'object') {
            cc.log(this);
            cc.warn('收到错误的消息 ==> ' + msg);
            return;
        }
        if (this[msg.cb]) {
            this[msg.cb](msg);
        }/*  else {
            cc.log('没有找到回调函数 ==> ' + msg);
        } */
    },

    /**
     * 替换字符串中的字段（字符串，索引，替换值）
     * pp.replaceString('##%d##%d##', '%d', 1, '%d', 2);
     */
    replaceString(...value) {
        let str = value[0];
        for (let i = 1; i < value.length; i += 2) {
            let v = value[i];
            let change = (i + 1 == value.length) ? '' : value[i + 1];
            if (str.indexOf(v) >= 0) {
                str = str.replace(v, change);
            }
        }
        return str;
    },

    /**
     * 设置精灵状态
     * @param {Number} state 0:正常状态 1:置灰状态
     */
    setState(node, state = 1) {
        node.$(cc.Sprite)._sgNode.setState(state);
    },

    // 是否激活触摸吞噬层
    swallowTouches(flag) {
        cc.find('Canvas/layer_swallow_touches').active = flag;
    },

    // 是否激活等待层
    waiting(flag) {
        cc.find('Canvas/layer_waiting').active = flag;
    },
};
window.pp = pp;