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
    editor: {
    	requireComponent: cc.Graphics,
		executeInEditMode: true
    }
    @property({
        type: cc.Label,
        tooltip: '生成二维码的字符'
    })
    codeLabel: cc.Label = null

    @property({
        type: cc.Node,
        tooltip: '二维码的父节点'
    })
    QRCodeNode: cc.Node = null

    @property({
        type: cc.Graphics,
        tooltip: '生成二维码的字符'
    })
    graphics: cc.Graphics = null

    @property(cc.Color)
    backColor: cc.Color = cc.Color.WHITE

    @property(cc.Color)
    foreColor: cc.Color = cc.Color.BLACK

    @property(cc.Integer)
    margin = 0

    start() {
        this.createQRCode()
    }
    // 生成二维码
    createQRCode() {
        const codeText = this.codeLabel.string.trim()
        if (!codeText) {
            alert('\u263b 莫得鸡，那来得蛋嘛 \u263b')
            return
        }
		if (cc.sys.browserType === cc.sys.BROWSER_TYPE_IE || true) {
            const codeNode = this.QRCodeNode || this.node
            this.getQRCodeBase64(codeText, codeNode)
			return
        }
        /**
         * 以下方法在1.9.3版本除IE浏览器外，测试无问题，但是在2.1.2版本，无法显示，暂未定位到原因
         */
        const graphics = this.graphics || this.node.getComponent(cc.Graphics)
        graphics.clear();
        //背景色
        graphics.fillColor = this.backColor;
        let width = this.node.width;
        graphics.fillRect(0, 0, width, width);
        graphics.close();
        //生成二维码数据
        let qrcode = new QRCode(-1, 2);
        qrcode.addData(codeText);
        qrcode.make();
        graphics.fillColor = this.foreColor;
        let size = width - this.margin * 2;
        let num = qrcode.getModuleCount();
        
        let tileW = size / num;
        let tileH = size / num;
        let w = Math.ceil(tileW);
        let h = Math.ceil(tileH);
        for (let row = 0; row < num; row++) {
            for (let col = 0; col < num; col++) {
                if (qrcode.isDark(row, col)) {
                    graphics.fillRect(this.margin + col * tileW, size - tileH - Math.round(row * tileH) + this.margin, w, h);
                }
            }
        }
    }
    /**
     * @description 获取二维码图片
     * @param url 生成的二维码的字符串
     * @param node 生成后的二维码挂载的节点，默认不挂载
     */
    getQRCodeBase64(url, node = null) {
        if (!url) return
        const div = document.createElement('div')
        new QRCodeWeb(div, url)
        const img = div.children[1]
        return new Promise(resolve=> {
            const imgBase64 = div.children[0].toDataURL('image/png')
            imgBase64 && resolve(imgBase64)
            img.onload = () => {
                if (!img.src) return
                if (node) {
                    const texture = new cc.Texture2D()
                    texture.initWithElement(img)
                    texture.handleLoadedTexture()
                    const spriteFrame = new cc.SpriteFrame(texture)
                    const sprite = node.getComponent(cc.Sprite) || node.addComponent(cc.Sprite)
                    sprite.spriteFrame = spriteFrame
                }
                resolve(img.src)
            }
            imgBase64 && !img.src && (img.src= imgBase64)
        })
    }
    // 保存二维码
    saveQRCode() {
        this.getQRCodeBase64(this.codeLabel.string.trim()).then(base64 => {
            cocosTools.downloadImg(base64)
        })
    }
}
