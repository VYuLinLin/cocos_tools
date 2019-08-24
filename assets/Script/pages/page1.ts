// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import cocosTools from '../CocosTools'

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: '要保存为图片的节点'
    })
    savaNode: cc.Node = null

    // web浏览器保存节点为图片
    saveNodeImg() {
        cocosTools.saveNodeImg(this.savaNode, 'mode.png')
    }
}
