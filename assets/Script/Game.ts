const {ccclass, property} = cc._decorator;
import cocosTools from './CocosTools'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;

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
        this.pageView && this.pageView.scrollToPage(index)
    }
    goback() {
        cc.director.loadScene('helloworld')
    }
}
