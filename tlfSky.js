(function(Play){

    var sky = function(options){

        this.ctx = options.ctx;
        this.skyImg = options.img;

        this.skySpeed = 2; //����ƶ��ٶ�
        this.skyW = this.skyImg.width;//����������img��ǩͼƬ������п��
        this.skyH = this.skyImg.height;

        this.x = options.x;
        this.y = 0;
    };
    sky.prototype = {
        constructor:sky,
        draw:function(){
            var ctx = this.ctx;
            this.x = this.x - this.skySpeed;
            if(this.x <= -this.skyW){
                this.x += this.skyW*2;
            }
            ctx.drawImage(this.skyImg,0,0,this.skyW,this.skyH,this.x,this.y,this.skyW,this.skyH);
        }
    }

    Play.getSky = function(options){
        return new sky(options);
    }

    //Play.Sky = sky;
})(Play);