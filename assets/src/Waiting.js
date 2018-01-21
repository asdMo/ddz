/**
 * 等待层功能实现
 * 节点size和画布同等大小
 * 节点挂blockInputEvents屏蔽底层触摸
 * 节点挂widget适配屏幕
 */
cc.Class({
    extends: cc.Component,

    properties: {
        waitRound: cc.Node,
    },

    onLoad() {
        this.waitRound.runAction(cc.rotateBy(2, 360).repeatForever());
    },

    onEnable() {
        this.waitRound.resumeAllActions();
    },

    onDisable() {
        this.waitRound.pauseAllActions();
    },
});
