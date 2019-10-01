const {ccclass, property} = cc._decorator;

@ccclass
class TransitionHandler {
    @property({
        type: cc.Node,
        tooltip: '过渡目标节点'
    })
    target: cc.Node = null

    @property({
        tooltip: '过渡持续时间，默认使用全局过渡时间0.5s'
    })
    duration = 0.5

    @property({
        tooltip: '初始X轴位置，默认当前节点X轴位置'
    })
    positionX = 0

    @property({
        tooltip: '初始Y轴位置，默认当前节点Y轴位置'
    })
    positionY = 0
}

@ccclass
export default class Transition extends cc.Component {
    editor: {
    	menu: 'Common/NodeTransition',
        executionOrder: 1,
        disallowMultiple: true
    }

    @property({
        type: TransitionHandler,
        tooltip: '需要过渡效果的节点及配置'
    })
    nodes: TransitionHandler[] = []

    @property(cc.EditBox)
    positionX: cc.EditBox = null

    @property(cc.EditBox)
    positionY: cc.EditBox = null

    onEnable() {
        this.runAction()
    }
    runAction() {
        let nodes = this.nodes
        interface node {
            duration
            positionX
            positionY
            target: {
                x: Number
                y: Number
                active: null
                getPosition: Function
                getComponent: Function
                runAction: Function
            }
        } 
        for (let i = 0, l = nodes.length; i < l; ++i) {
            const {target, positionX, positionY, duration} = nodes[i] as node
            if (!target || (!positionX && !positionY)) continue
            if (!target.active) continue
            const ve2 = target.getPosition()
            const actionTo = cc.moveTo(duration, ve2)
            const widget = target.getComponent(cc.Widget)
            widget && (widget.enabled = false)
            const restoreFn = cc.callFunc(() => {
                widget && (widget.enabled = true)
            })
            positionX && (target.x = positionX)
            positionY && (target.y = positionY)
            setTimeout(() => { target.runAction(cc.sequence(actionTo, restoreFn)) }, 0)
        }
    }
    /**
     * 运行按钮
     */
    onClickRun() {
        this.nodes.forEach(item => {
            item.positionX = Number(this.positionX.string)
            item.positionY = Number(this.positionY.string)
        })
        this.runAction()
    }
}
