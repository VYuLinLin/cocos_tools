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

    @property(cc.Label)
    imgUrl: cc.Label = null

    // 下载图片
    downloadImg() {
        const imgUrl = this.imgUrl.string.trim()
        if (!imgUrl) {
            alert('莫得图片。晓得不。\u263b')
            return
        }
        cocosTools.downloadImg(imgUrl, 'img.png')
    }
}
