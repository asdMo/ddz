/**
 * 把本地数据库的接口从sys.localStorage 挪到这里，以便进行显示的调用
 * cocos2dx 中存取数据时都是用的字符串，也就是恢复为具体数据类型的逻辑需要自己去写
 */

let ls = {
    _TAG: 'LocalStorage',
    _packageName: 'com.ssy.ddz' + '.',
    _ls: cc.sys.localStorage,

    // LocalStorage key
    jewel: 'JEWEL',                                         // 钻石
    curLevel: 'CUR_LEVEL',                                  // 当前关卡

    init() {
        this.initSameKey(false);
        // 初始化一次键值对
        if (!this.getItem(this._packageName)) {
            this.setItem(this._packageName, true);

            this.initSameKey(true);
            this.setItem(this.jewel, 100);
            this.setItem(this.curLevel, 0);
        }
    },

    // 初始化接近相同的key
    initSameKey(flag) {
        for (let i = 0; i < 3; i++) {
            this['test_' + i] = 'TEST_' + i;
            if (flag) {
                this.setItem(this['test_' + i], 0);
            }
        }
    },

    // 重新初始化数据
    reset() {
        cc.log('重置数据');
    },

    setItem(key, value) {
        if (!key || typeof (key) !== 'string' || typeof (key) === 'undefined' || key.length === 0) {
            cc.warn(this._TAG + ' setItem param error key ==> ' + key);
            return;
        };
        // Encrypt
        let ciphertext = btoa(encodeURI(value + ''));
        // cc.log(key, value, ciphertext);
        this._ls.setItem(this._packageName + key, ciphertext);
    },

    getItem(key) {
        if (!key || typeof (key) !== 'string' || typeof (key) === 'undefined' || key.length === 0) {
            cc.warn(this._TAG + ' getItem param error key ==> ' + key);
            return;
        };
        let value = this._ls.getItem(this._packageName + key);
        if (value === null) {
            return;
        }
        // Decrypt
        let decryptionText = decodeURI(atob(value));
        // cc.log(key, value, decryptionText);
        if (decryptionText === 'true') {
            decryptionText = true;
        } else if (decryptionText === 'false') {
            decryptionText = false;
        }
        return decryptionText;
    },

    removeItem(key) {
        if (!key || typeof (key) !== 'string' || typeof (key) === 'undefined' || key.length === 0) {
            cc.warn(this._TAG + ' removeItem param error key ==> ' + key);
            return;
        };
        this._ls.removeItem(this._packageName + key);
    },

    getItemInt(key) {
        return parseInt(this.getItem(key));
    },

    getItemFloat(key) {
        return parseFloat(this.getItem(key));
    },

    setItemStringify(key, value) {
        this.setItem(key, JSON.stringify(value));
    },

    getItemParse(key) {
        return JSON.parse(this.getItem(key));
    },

    getStorage() {
        return Object.keys(this._ls);
    },
};
ls.init();
window.ls = ls;
