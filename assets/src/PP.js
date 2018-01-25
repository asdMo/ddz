/**
 * 全局变量pp
 */

// cc.RigidBodyType.Static 静态刚体，零质量，零速度，即不会受到重力或速度影响，但是可以设置他的位置来进行移动。
// cc.RigidBodyType.Dynamic 动态刚体，有质量，可以设置速度，会受到重力影响。
// cc.RigidBodyType.Kinematic 运动刚体，零质量，可以设置速度，不会受到重力的影响，但是可以设置速度来进行移动。
// cc.RigidBodyType.Animated 动画刚体，在上面已经提到过，从 Kinematic 衍生的类型，主要用于刚体与动画编辑结合使用。

// 是否激活物理系统
// cc.director.getPhysicsManager().enabled = true;
// 是否显示左下角调试信息
// cc.director.setDisplayStats(false);
// 获取碰撞检测系统
// var manager = cc.director.getCollisionManager();
// 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
// manager.enabled = true;
// 默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制
// manager.enabledDebugDraw = true;
// 如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置
// manager.enabledDrawBoundingBox = true;
// 如果开启此选项，那么将会以一个固定的时间步来更新物理引擎，如果一个 update 的间隔时间大于这个时间步，则会对物理引擎进行多次更新。 
// 如果关闭此选项，那么将会根据设定的 frame rate 计算出一个时间步来更新物理引擎
// cc.director.getPhysicsManager().enabledAccumulator = true;

// 物理debug
// cc.director.getPhysicsManager().debugDrawFlags =
// cc.PhysicsManager.DrawBits.e_aabbBit |
// cc.PhysicsManager.DrawBits.e_pairBit |
// cc.PhysicsManager.DrawBits.e_centerOfMassBit |
// cc.PhysicsManager.DrawBits.e_jointBit |
// cc.PhysicsManager.DrawBits.e_shapeBit;

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
