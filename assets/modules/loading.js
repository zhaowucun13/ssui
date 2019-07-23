/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out){
	//备注：依赖init.css样式
    function Loading(obj) {
        this.sourceObj = obj;
		this.domWrap = {};//dom容器
        this.scope = {};//scope容器
        this.init();//初始化
    }
    Loading.prototype = {
        constructor:Loading,
        //初始化
		init:function(){
            this.rd_shadowFn();//遮罩
		},
        //| 渲染  | 
        //遮罩层
        rd_shadowFn:function(){
            var self = this,obj = self.sourceObj;
            self.domWrap['shadow'] = ss.crtDom('div','ss_loading_shadow','',window.document.body,{
               cn:[
                   'position','top','left','width','height','backgroundColor','zIndex',
                   'display'
                ],
               cv:[
                   'fixed','0px','0px',ss.paraWrap.clwx,ss.paraWrap.clhx,'#000',9999,
                   'none'
                ] 
            });  
        },
        //渲染整体容器
        //type:1
        rd_conWrapFn1:function(configObj){
            var self = this,obj = self.sourceObj;
            var configObj = configObj || {};
            //存在添加容器
            configObj.el && (configObj.el.style.position = 'relative');
            self.domWrap['conWrap1'] = ss.crtDom('div','ss_loading_conWrap1','',configObj.el || window.document.body,{
                cn:[
                    'position','left','transform','width','height',
                    'textAlign','fontSize','top','zIndex','display'
                ],
                cv:[
                    configObj.el?'absolute':'fixed','50%','translate(-50%,-50%)','auto','auto',
                    'center','10px','50%',10000,'none'
                ]                
            })
            .appendDom(function(dom){
                ['-1.2s','-1.1s','-1s','-0.9s','-0.8s'].forEach(function(item){
                    var curDiv = ss.crtDom('div','','',dom,{
                        cn:[
                            'backgroundColor','height','width','display',
                            'animation','animationDelay','marginRight'
                        ],
                        cv:[
                            configObj.color||'rgb(111, 175, 235)','40px','6px','inline-block',
                            'loading1 1.2s infinite ease-in-out',item,'5px'
                        ]                        
                    });
                });
            });
            document.styleSheets[0].insertRule(
                "@keyframes loading1 { 0%, 40%, 100% { transform: scaleY(0.4);} 20% { transform: scaleY(1); } }",0
            );//写入样式
        },
        //type:2
        rd_conWrapFn2:function(configObj){
            var self = this,obj = self.sourceObj;
            var configObj = configObj || {};
            self.domWrap['conWrap2'] = ss.crtDom('div','','',ss.getDom('body'),{
                cn:[
                    'position','left','transform','width','height',
                    'textAlign','fontSize','top','zIndex','display'
                ],
                cv:[
                    'fixed','50%','translate(-50%,-50%)','auto','auto',
                    'center','10px','50%',10000,'none'
                ]                
            })
            .appendDom(function(dom){
                var curDiv = ss.crtDom('div','','',dom,{
                    cn:[
                        'width','height','backgroundColor',
                        'top','zIndex',
                        'animation'
                    ],
                    cv:[
                        '40px','40px',configObj.color||'#7ed491',
                        '50%',10000,
                        'loading2 1.2s infinite ease-in-out'
                    ]                
                });
            });
            document.styleSheets[0].insertRule(
                "@keyframes loading2 { 0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); } 100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } }",1
            );//写入样式
        },
        //| 逻辑  |
        //显示
        show:function(configObj){
            var self = this,obj = self.sourceObj;
            var configObj = configObj || {};
            configObj.isDecorate = true;
            //创建缓冲动画
            this['rd_conWrapFn'+(configObj.type||1)](configObj);
            //显示遮罩层
            ss.mdfCss(self.domWrap.shadow,[
                'display','none','opacity',configObj.opacity == 0 ? 0 : (configObj.opacity||.05) ,
                'zIndex',configObj.zIndex_s||9999
            ]);
            //显示缓冲动画
            ss.mdfCss(self.domWrap['conWrap'+(configObj.type||1)],[
                'display','block','zIndex',configObj.zIndex_c||10000,
                'top',configObj.top||'40%'
            ]);
            //是否需要底部盒子装饰
            configObj.isDecorate && ss.mdfCss(self.domWrap['conWrap'+(configObj.type||1)],[
                'boxShadow','0px 0px 4px .5px #ccc','padding','10px',
                'borderRadius','5px','backgroundColor','#fff'
            ]);
        },
        //隐藏
        hidden:function(configObj){
            var self = this,obj = self.sourceObj;
            var configObj = configObj || {}; 
			var _dom = ss.getDom('.ss_loading_conWrap1');
			_dom.parentNode.removeChild(_dom);	
			var _dom2 = ss.getDom('.ss_loading_shadow');
			_dom2.style.display = 'none';
        }

    };
    out('loading',new Loading());
})



