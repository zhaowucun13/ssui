(function(Play){

    var Bird = function(options){

        //����������
        this.ctx = options.ctx;
        //��ȡС����Ϸ�����ͼƬ
        this.birdImage = options.img;

        //ͼƬ��С��ÿһ֡�Ŀ��
        this.birdImgW = this.birdImage.width / 3;
        this.birdImgH = this.birdImage.height;
        //���Ƶ�ǰ������һ֡�ı���
        this.frameIndex = 0;

        //����С�����µ��ı���
        this.speed = 0;//�ٶ�
        this.a = 0.0005;//���ٶ�

        //С��ֱ����ĳ���λ��
        this.y = 100; //y��
        this.x = 100;
        //����С��ͷ�����µı���
        this.headMaxAngle = 45;
        this.headMaxSpeed = 0.5;
    };//Bird���캯��


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