
cc.Class({
    extends: cc.Component,

    properties: {
        _factor: 4.0,
        factor: {
            get: function () {
                return this._factor;
            },

            set: function (v) {
                this._factor = v;
            }
        },

        _radius: 52.0,
        radius: {
            get: function () {
                return this._radius;
            },

            set: function (v) {
                this._radius = v;
            }
        },

        material: cc.Material,
    },

    onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.sprite.setMaterial(0, this.material);

        this.update();
    },

    update() {
        var frame = this.sprite.spriteFrame;
        var texture = frame.getTexture();
        var rect = frame.getRect();

        if (texture != this._shaderTexture || !frame.getRect().equals(this._shaderFrame.getRect())) {
            this._shaderTexture = texture;
            this._shaderFrame = frame;

            var material = this.sprite.getMaterial(0);
            material.setProperty('textureSize', { x: this.node.width, y: this.node.height });
            material.setProperty('factor', this.factor);
            material.setProperty('radius', this.radius);

            var uv_factor_1 = { x: rect.x / texture.width, y: rect.y / texture.height };
            var uv_factor_2 = { x: rect.width / texture.width, y: rect.height / texture.height };

            material.setProperty('uv_factor_1', uv_factor_1);
            material.setProperty('uv_factor_2', uv_factor_2);
        }
    },
});
