const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('Common/LoadPrefab')
class ItemPrefab extends cc.Component {
    @property({
        type: cc.Prefab,
        tooltip: '需要绑定的prefab'
    })
    prefab: cc.Prefab = null

    @property({
        type: cc.Node,
        tooltip: '预制体实例化的父节点'
    })
    parentNode: cc.Node = null

    @property({
        tooltip: '是否自动加载'
    })
    autoLoad: Boolean = true

    @property({
        tooltip: '是否设为常驻节点'
    })
    isPersist: Boolean = false

    onLoad () {
        const {node, prefab, parentNode, autoLoad, isPersist} = this
        
        autoLoad && prefab && (cc.instantiate(prefab).parent = parentNode || node)
        isPersist && cc.game.addPersistRootNode(node);
    }
}
