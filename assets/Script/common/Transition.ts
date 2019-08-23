const {ccclass, property, menu} = cc._decorator;
// 单个节点过渡效果
class TransitionHandler extends cc.Component {
    name: 'cc.TransitionHandler'

        @property({
            type: cc.Node,
            tooltip: '过渡目标节点'
        })
        target: cc.Node = null

        @property({
            type: cc.Float,
            tooltip: '过渡持续时间，默认过渡时间0.5s'
        })
        duration: cc.Float = 0.5

        @property({
            type: cc.Integer,
            tooltip: '初始X轴位置，默认当前节点X轴位置'
        })
        positionX: cc.Integer = 0
        
        @property({
            type: cc.Integer,
            tooltip: '初始Y轴位置，默认当前节点Y轴位置'
        })
        positionY: cc.Integer = 0
}

@ccclass
@menu('Common/Transition')
export default class NewClass extends cc.Component {

    @property({
        type: TransitionHandler,
        tooltip: '需要过渡效果的节点及配置'
    })
    nodes: TransitionHandler = []

    onEnable() {
        const nodes = this.nodes
        for (let i = 0, l = nodes.length; i < l; ++i) {
            const {target, positionX, positionY, duration} = nodes[i]
            if (!target || (!positionX && !positionY)) continue
            if (!target.active) continue
            const ve2 = target.getPosition()
            const actionTo = cc.moveTo(duration, ve2)
            const widget = target.getComponent(cc.Widget)
            widget && (widget.enabled = false)
            const restoreFn = cc.callFunc(() => {
                widget && (widget.enabled = true)
            })
            positionX && target.setPositionX(positionX)
            positionY && target.setPositionY(positionY)
            setTimeout(() => { target.runAction(cc.sequence(actionTo, restoreFn)) }, 0)
        }
    }
}
