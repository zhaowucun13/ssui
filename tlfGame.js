(function(){
    var game = function(options){
        this.ctx = options.ctx;
        this.arcList = ["birds","land","pipe1","pipe2","sky"];
        this.roles = [];
        this.isPlay = false;

        this.beforeFrameTime = new Date();//进入小鸟绘制自调用函数之前的时间
        this.curFrameTime = 0; //创建小鸟绘制自调用函数的每一次绘制当前时间
        this.delta = 0; //时间间隔

    };
    game.prototype = {
        constructor:game,
        //游戏开始!!!
        start:function(){
            var self = this;
            Play.imgsLoad(self.arcList,function(imgsObj){
                self.isPlay = true;
                self.initRoles(imgsObj);
                self.render(imgsObj);
                self.bindEvent();

            })
        },
        //游戏结束!!!
        gameOver:function(){
            this.isPlay = false;
        },
        //初始化角色!!!
        initRoles:function(imgsObj){

            var self = this;
            //绘制天空------------------------------------
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

            //绘制管道-------------------------------------
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

            //绘制陆地---------------------------------------
            for(var i=0; i<4; i++){
                var land = new Play.Land({
                    ctx:ctx,
                    img:landObj,
                    x:i*landObj.width,
                    y:cv.height - landObj.height
                })
                self.roles.push(land);
            }

            //绘制小鸟-------------------------------------------
            var bird = new Play.Bird({
                ctx:ctx,
                img:imgsObj["birds"]
            });
            self.bird = bird;
        },
        //渲染!!!
        render:function(imgsObj){
            var self = this;
            var landObj = imgsObj["land"];
            var cv = this.ctx.canvas;
            //渲染自执行方法^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            (function render() {
                self.ctx.clearRect(0, 0, cv.width, cv.height);
                self.ctx.beginPath();
                // 计算时间
                self.curFrameTime = new Date();
                // 两帧绘制的时间间隔
                self.delta = self.curFrameTime - self.beforeFrameTime;
                self.beforeFrameTime = self.curFrameTime;

                //遍历每个角色的绘画动画
                self.roles.forEach(function(role){
                    role.draw(self.delta);
                })

                // 调用bird的绘制自身的方法
                self.bird.draw( self.delta );

                //控制游戏始末
                if(self.bird.y <= 0 || self.bird.y >= (cv.height - landObj.height) || ctx.isPointInPath(self.bird.x,self.bird.y)){
                    self.isPlay = false;

                }
                if(self.isPlay){
                    // 参数为：当前的函数
                    window.requestAnimationFrame(render);
                }

            })();
        },
        //绑定事件!!!
        bindEvent:function(){
            var self = this;
            //点击事件+++++++++++++++++++++++++++++++++++++++++++
            self.ctx.canvas.addEventListener("click", function () {
                console.log(1);
                self.bird.speed = -.2;
            });

        }
    };
    Play.Game = game;
})(Play);