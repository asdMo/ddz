/**
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        layerPoker: cc.Node,
    },

    initAttr() {
        this.pokerList = [];                                        // 扑克列表
        this.spacingX = 25;                                         // X间距
        this.startPoint = null;                                     // 触摸起点坐标
        this.curPoker = null;                                       // 点击的第一个扑克,防止多点触控
    },

    onLoad() {
        this.registrationAndCancellationEvent(true);
        this.initTouchEvent();
        this.init();


    },

    onDestroy() {
        this.registrationAndCancellationEvent(false);
        if (this.touchListener) {
            cc.eventManager.removeListener(this.touchListener);
            this.touchListener = null;
        }
    },

    registrationAndCancellationEvent(flag) {
        let eventName = flag ? 'on' : 'off';
        pp.customEvent[eventName]('netOpen', this.callNetOpen, this);
    },

    init() {
        this.initAttr();
        cc.loader.loadRes('poker', cc.SpriteAtlas, (error, assets) => {
            if (error) {
                return;
            }
            // cc.log(assets);
            let atlas = assets.getSpriteFrames();
            for (let i = 0; i < 18; i++) {
                let node = new cc.Node('poker');
                node.parent = this.layerPoker;
                node.addComponent(cc.Sprite).spriteFrame = atlas[i];
                node.position = cc.p(i * this.spacingX - 200, -200);
                node.isClick = false;
                node.isUp = false;
                this.pokerList.push(node);
            }
        });
    },

    initTouchEvent() {
        // 使用TOUCH_ONE_BY_ONE防止多点触屏
        this.touchListener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchStart.bind(this),
            onTouchMoved: this.onTouchMove.bind(this),
            onTouchEnded: this.onTouchEnd.bind(this),
        }, this.node);
    },

    onTouchStart(touch, event) {
        if (this.curPoker) {
            return false;
        }
        this.startPoint = this.layerPoker.convertToNodeSpace(touch.getLocation());
        this.checkCollision(this.startPoint);
        if (!this.curPoker) {
            return false;
        }
        return true;
    },

    onTouchMove(touch, event) {
        let movePoint = this.layerPoker.convertToNodeSpace(touch.getLocation());
        this.checkCollision(movePoint);
        this.checkReverse(this.startPoint, movePoint);
    },

    onTouchEnd(touch, event) {
        for (let el of this.pokerList) {
            if (el.isClick) {
                el.isClick = false;
                el.color = cc.color(255, 255, 255);
                if (el.isUp) {
                    el.isUp = false;
                    el.y -= 20;
                } else {
                    el.isUp = true;
                    el.y += 20;
                }
            }
        }
        this.curPoker = null;
    },

    // 检测触摸牌
    checkCollision(pos) {
        let i = this.pokerList.length;
        while (i--) {
            let node = this.pokerList[i];
            if (cc.rectContainsPoint(node.getBoundingBox(), pos)) {
                node.isClick = true;
                node.color = cc.color(230, 160, 160);
                this.curPoker = node;
                break;
            }
        }
    },

    /**
     * 检测反向摸牌
     * @param {cc.p} p1 起点坐标
     * @param {cc.p} p2 移动坐标
     */
    checkReverse(p1, p2) {
        let p = p1.x < p2.x ? p1 : p2;
        if (p === p2) {
            for (let el of this.pokerList) {
                if (p.x - el.x > -this.spacingX) {
                    el.isClick = false;
                    el.color = cc.color(255, 255, 255);
                }
            }
        } else {
            let width = Math.abs(p1.x - p2.x);
            let height = Math.abs(p1.y - p2.y) > 5 ? Math.abs(p1.y - p2.y) : 5;
            let rect = cc.rect(p.x, p.y, width, height);
            for (let el of this.pokerList) {
                if (!cc.rectIntersectsRect(el.getBoundingBox(), rect)) {
                    el.isClick = false;
                    el.color = cc.color(255, 255, 255);
                }
            }
        }
    },

    callNetOpen(event) {

    },
});
