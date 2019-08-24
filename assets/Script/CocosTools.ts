
export default {
    /**
     * @description Native保存节点为图片
     * @param {cc.Node} node 保存的节点
     * @param {String} fileName 保存的图片名称
     */
    tackPhoto: function (node, fileName) {
        var pp = node.parent
        var op = node.position
        var runScene = cc.director.getScene()
        var nn = new cc.Node()
        runScene.addChild(nn)
        nn.x = node.width / 2
        nn.y = node.height / 2
        node.parent = runScene
        node.position = cc.p(node.width / 2, node.height / 2)
        var renderTexture = cc.RenderTexture.create(node.width, node.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES)
        renderTexture.setVisible(false);
        nn._sgNode.addChild(renderTexture)
        renderTexture.begin()
        runScene._sgNode.visit()
        renderTexture.end()
        renderTexture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG)
        node.active = false
        setTimeout(function () {
            node.parent = pp
            node.position = op
            node.active = true
            fileName = jsb.fileUtils.getWritablePath() + fileName
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "photoTo", "(Ljava/lang/String;)V", fileName)
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppController", "photoTo:", fileName)
            }
        }, 10)
        nn.destroy()
    },
    /**
     * @description web浏览器单节点保存为图片
     * @param {cc.Node} node 保存的节点
     * @param {String} fileName 保存的图片名字
     */
    saveNodeImg(node: cc.Node, fileName: String) {
        if (!(node instanceof cc.Node)) return
        let callback = null

        if (new cc.RenderTexture().initWithSize) {
            // 2.x web截屏
            let texture = new cc.RenderTexture()
            texture.initWithSize(node.width, node.height)    
    
            const {width, height} = node
            const camera =  node.addComponent(cc.Camera)
            camera.targetTexture = texture
            const canvasEl = document.createElement('canvas')
            let ctx = canvasEl.getContext('2d')
            canvasEl.width = width
            canvasEl.height = height
            camera.render(node)
            let data = texture.readPixels()
            node.removeComponent(camera)
            let rowBytes = width * 4
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row
                let imageData = ctx.createImageData(width, 1)
                let start = srow * width * 4
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start+i]
                }
                ctx.putImageData(imageData, 0, row)
            }
            callback = function() {
                const base64 = canvasEl.toDataURL()
                this.downloadImg(base64, fileName)
                cc.director.off(cc.Director.EVENT_AFTER_DRAW)
            }
        } else {
            // 2.x 版本以下，只在1.9.3测试无问题
            node = cc.instantiate(node)
            let {width, height} = cc.game.canvas
            const runScene = cc.director.getScene()
            const canvasNode = cc.find('Canvas')
            const roomIndexs = []
            const canvasIndexs = []
            runScene.children.map((roomNode, i) => {
                if (roomNode.name !== 'Canvas' && roomNode.active) {
                    roomNode.active = false
                    roomIndexs.push(i)
                }
            })
            canvasNode.children.map((node, i) => {
                node.active && (node.active = false, canvasIndexs.push(i))
            })
            cc.view.setCanvasSize(node.width, node.height)
            canvasNode.width = node.width
            canvasNode.addChild(node)
            callback = function() {
                const base64 = cc.game.canvas.toDataURL()
                this.downloadImg(base64, fileName)
                cc.director.off(cc.Director.EVENT_AFTER_DRAW)
                canvasNode.removeChild(node)
                cc.view.setCanvasSize(width, height)
                roomIndexs.map(i => { runScene.children[i].active = true })
                canvasIndexs.map(i => { canvasNode.children[i].active = true })
            }
        }
        
        // 等渲染之后才能获取画布上的内容
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, callback.bind(this))
    },
    /**
     * @description 浏览器下载图片，兼容ie
     * @param {imgUrl|URL} imgUrl 图片的base64格式或图片Url
     * @param {String} fileName 图片名称
     */
    downloadImg(imgUrl, fileName = 'QRcode.png') {
        if (!cc.sys.isBrowser) return
        if (window.navigator.msSaveOrOpenBlob) {
            // 支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候）
            const arr = imgUrl.split(',')
            const type = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            let blob
            while (n--) u8arr[n] = bstr.charCodeAt(n)
            try {
                blob = new Blob([u8arr, {type}])
            } catch (e) {
                // 兼容旧版IE，如IE11
                window.BlobBuilder = window.BlobBuilder ||
                                     window.WebKitBlobBuilder ||
                                     window.MozBlobBuilder ||
                                     window.MSBlobBuilder;
                if (window.BlobBuilder) {
                    var bb = new BlobBuilder();
                    bb.append(u8arr);
                    blob = bb.getBlob(type);
                }
            }
            window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
            const aEl = document.createElement('a')
            const evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            aEl.download = fileName
            aEl.target = '_blank' // safari浏览器在新标签页显示
            aEl.href = imgUrl
            document.body.appendChild(aEl)
            aEl.dispatchEvent(evt) // 兼容火狐浏览器
            document.body.removeChild(aEl)
        }
    },
}