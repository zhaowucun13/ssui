(function(Play){
        var land = function(options){
            this.ctx = options.ctx;
            this.land1 = options.img;

            this.landImgW = this.land1.width;
            this.landImgH = this.land1.height;

            this.landSpeed = 2; //天空移动速度

            this.x = options.x;
            this.y = options.y;

        };

        land.prototype.draw = function(){

            var ctx = this.ctx;

            this.x = this.x - this.landSpeed;

            if(this.x <= -this.landImgW){
                this.x += this.landImgW*4;
            }

            ctx.drawImage(this.land1,0,0,this.landImgW,this.landImgH,this.x,this.y,this.landImgW,this.landImgH);

        }

        Play.Land = land;

})(Play)