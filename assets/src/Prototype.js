/**
 * 重写函数
 */

// cc.RigidBodyType.Static 静态刚体，零质量，零速度，即不会受到重力或速度影响，但是可以设置他的位置来进行移动。
// cc.RigidBodyType.Dynamic 动态刚体，有质量，可以设置速度，会受到重力影响。
// cc.RigidBodyType.Kinematic 运动刚体，零质量，可以设置速度，不会受到重力的影响，但是可以设置速度来进行移动。
// cc.RigidBodyType.Animated 动画刚体，在上面已经提到过，从 Kinematic 衍生的类型，主要用于刚体与动画编辑结合使用。

// 物理debug
// cc.director.getPhysicsManager().debugDrawFlags =
// cc.PhysicsManager.DrawBits.e_aabbBit |
// cc.PhysicsManager.DrawBits.e_pairBit |
// cc.PhysicsManager.DrawBits.e_centerOfMassBit |
// cc.PhysicsManager.DrawBits.e_jointBit |
// cc.PhysicsManager.DrawBits.e_shapeBit;

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

// 屏幕适配方案
cc.Canvas.prototype.applySettings = function () {
    let width = this.designResolution.width;
    let height = this.designResolution.height;
    if (CC_EDITOR) {
        cc.engine.setDesignResolutionSize(width, height);
    } else {
        if (cc.sys.isMobile) {
            // 横屏 FIXED_HEIGHT 竖屏 FIXED_WIDTH 或者强制拉伸 EXACT_FIT
            cc.view.setDesignResolutionSize(width, height, cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            cc.view.setDesignResolutionSize(width, height, cc.ResolutionPolicy.SHOW_ALL);
        }
    }
};

cc.Node.prototype.$ = cc.Component.prototype.$ = cc.Component.prototype.getComponent;
cc.Node.prototype.gn = cc.Node.prototype.getChildByName;
cc.Node.prototype.gt = cc.Node.prototype.getChildByTag;

// 清除自身
cc.Node.prototype.cleanSelf = function () {
    this.destroy();
    if (this.parent) {
        this.removeFromParent();
    }
}

// 暂停节点
cc.Node.prototype.doPause = function (flag) {
    if (!this.active) {
        return;
    }
    if (this.getNumberOfRunningActions() > 0) {
        flag ? this.pauseAllActions() : this.resumeAllActions();
    }
    let ani = this.$(cc.Animation);
    if (ani) {
        flag ? ani.pause() : ani.resume();
    }
    flag ? this.pauseSystemEvents(true) : this.resumeSystemEvents(true);
};
