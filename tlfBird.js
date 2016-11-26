(function(Play){

    var Bird = function(options){

        //绘制上下文
        this.ctx = options.ctx;
        //获取小鸟游戏对象的图片
        this.birdImage = options.img;

        //图片中小鸟每一帧的宽高
        this.birdImgW = this.birdImage.width / 3;
        this.birdImgH = this.birdImage.height;
        //控制当前绘制哪一帧的变量
        this.frameIndex = 0;

        //绘制小鸟往下掉的变量
        this.speed = 0;//速度
        this.a = 0.0005;//加速度

        //小鸟垂直方向的初试位置
        this.y = 100; //y轴
        this.x = 100;
        //绘制小鸟头部朝下的变量
        this.headMaxAngle = 45;
        this.headMaxSpeed = 0.5;
    };//Bird构造函数


    Bird.prototype = {
        constructor:Bird,
        draw:function(delta){

            this.speed = this.speed + this.a * delta;
            this.y = this.y + this.speed * delta + 1 / 2 * this.a * delta * delta;

            this.headCurAngle = 0;
            headCurAngle = this.speed / this.headMaxSpeed * this.headMaxAngle;
            if (headCurAngle >= this.headMaxAngle) {
                headCurAngle = this.headMaxAngle;
            }

            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(headCurAngle / 180 * Math.PI);

            this.ctx.drawImage(this.birdImage, this.birdImgW * this.frameIndex, 0, this.birdImgW, this.birdImgH, -1 / 2 * this.birdImgW, -1 / 2 * this.birdImgH, this.birdImgW, this.birdImgH);
            this.ctx.restore();

            this.frameIndex++;
            this.frameIndex %= 3;

        }

    };//Bird.prototype


    Play.Bird = Bird;
})(Play);