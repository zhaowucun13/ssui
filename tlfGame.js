(function(){
    var game = function(options){
        this.ctx = options.ctx;
        this.arcList = ["birds","land","pipe1","pipe2","sky"];
        this.roles = [];
        this.isPlay = false;

        this.beforeFrameTime = new Date();//����С������Ե��ú���֮ǰ��ʱ��
        this.curFrameTime = 0; //����С������Ե��ú�����ÿһ�λ��Ƶ�ǰʱ��
        this.delta = 0; //ʱ����

    };
    game.prototype = {
        constructor:game,
        //��Ϸ��ʼ!!!
        start:function(){
            var self = this;
            Play.imgsLoad(self.arcList,function(imgsObj){
                self.isPlay = true;
                self.initRoles(imgsObj);
                self.render(imgsObj);
                self.bindEvent();

            })
        },
        //��Ϸ����!!!
        gameOver:function(){
            this.isPlay = false;
        },
        //��ʼ����ɫ!!!
        initRoles:function(imgsObj){

            var self = this;
            //�������------------------------------------
            var skyObj = imgsObj["sky"];
            var landObj = imgsObj["land"];

            for(var i=0; i<2; i++){
                var sky = Play.getSky({
                    ctx:ctx,
                    img:skyObj,
                    x:i*skyObj.width
                });
                self.roles.push(sky);
            };

            //���ƹܵ�-------------------------------------
            var pipeUpObj = imgsObj["pipe2"];
            var pipeDownObj = imgsObj["pipe1"];

            for(var i=0; i<6; i++){
                var pipe = new Play.Pipe({
                    ctx:ctx,
                    imgUp : pipeUpObj,
                    imgDown : pipeDownObj,
                    x : pipeUpObj.width * 3 * i + 300
                });
                self.roles.push(pipe);
            }

            //����½��---------------------------------------
            for(var i=0; i<4; i++){
                var land = new Play.Land({
                    ctx:ctx,
                    img:landObj,
                    x:i*landObj.width,
                    y:cv.height - landObj.height
                })
                self.roles.push(land);
            }

            //����С��-------------------------------------------
            var bird = new Play.Bird({
                ctx:ctx,
                img:imgsObj["birds"]
            });
            self.bird = bird;
        },
        //��Ⱦ!!!
        render:function(imgsObj){
            var self = this;
            var landObj = imgsObj["land"];
            var cv = this.ctx.canvas;
            //��Ⱦ��ִ�з���^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            (function render() {
                self.ctx.clearRect(0, 0, cv.width, cv.height);
                self.ctx.beginPath();
                // ����ʱ��
                self.curFrameTime = new Date();
                // ��֡���Ƶ�ʱ����
                self.delta = self.curFrameTime - self.beforeFrameTime;
                self.beforeFrameTime = self.curFrameTime;

                //����ÿ����ɫ�Ļ滭����
                self.roles.forEach(function(role){
                    role.draw(self.delta);
                })

                // ����bird�Ļ�������ķ���
                self.bird.draw( self.delta );

                //������Ϸʼĩ
                if(self.bird.y <= 0 || self.bird.y >= (cv.height - landObj.height) || ctx.isPointInPath(self.bird.x,self.bird.y)){
                    self.isPlay = false;

                }
                if(self.isPlay){
                    // ����Ϊ����ǰ�ĺ���
                    window.requestAnimationFrame(render);
                }

            })();
        },
        //���¼�!!!
        bindEvent:function(){
            var self = this;
            //����¼�+++++++++++++++++++++++++++++++++++++++++++
            self.ctx.canvas.addEventListener("click", function () {
                console.log(1);
                self.bird.speed = -.2;
            });

        }
    };
    Play.Game = game;
})(Play);