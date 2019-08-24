const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    menuContent: cc.Node = null

    @property(cc.PageView)
    pageView: cc.PageView = null

    start () {
        this.setContentHeight()
    }
    // 设置内容的高度
    setContentHeight() {
        let totalHeight = 0
        if (!this.pageView) return
        this.pageView.content.children.map(node => {
            totalHeight += node.height
        })
        this.pageView.content.height = totalHeight
    }
    // 滚动内容区到指定页
    scrollToPage(event = null, index = 0) {
        if(!this.pageView) return
        this.pageView.scrollToPage(index, 0)
        this.scrollPageCallBack(null, +index)
    }
    // 页面滚动回调
    scrollPageCallBack(event, index = null) {
        const content:cc.Node = this.menuContent
        if (!content) return
        const curPageIdx = event ? event._curPageIdx : index
        const children: Array<cc.Node> = content.children
        for (let i = 0; i < children.length; i++) {
            const Background = children[i].getChildByName('Background');
            Background.color = curPageIdx === i ? new cc.Color(190, 120, 255, 255) : new cc.Color(120, 250, 255, 255)
        }
    }
    // 返回
    goback() {
        cc.director.loadScene('helloworld')
    }
}
