/**
 * 重写函数
 */

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
