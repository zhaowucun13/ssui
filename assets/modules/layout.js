/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out){

    function ss_layout(obj){
        this.sourceObj = obj;
        this.init();//初始化
    };
    ss_layout.prototype = {
        constructor:ss_layout,
        //初始化
        init:function(){
            this.rd_layoutFn();//布局
            this.rd_tabTitleFn();//tab标题开闭
            // this.lg_saveTxtFn();//点击字段存储
            // this.theEndFn();
        },
        //theEnd
        theEndFn:function(){
            var bodyDom = ss.getDom('body');
            //处理body样式
            ss.mdfCssAttr(bodyDom,{
                cn:['width','height','overflow'],
                cv:['100%','hidden']
            });
            bodyDom.appendChild(this.domWrap.ly_Containter);//追加到文档
            ss.layoutFnWrap['lg_clearStatuFn'] = this.lg_clearStatuFn;
            ss.layoutFnWrap['lg_shwoTtFn'] = this.lg_shwoTtFn;
            ss.layoutFnWrap['self'] = this;
        },
        domWrap:{},//layout容器
        tabTitleWrap:[],//tab标题存储
        tabDomWrap:{},//tabDom存储
        //布局
        rd_layoutFn:function(){
            var self = this,obj = self.sourceObj;
            var tempContainer = document.createDocumentFragment();
            var _height = obj.el ? obj.el.offsetHeight+'px': ss.paraWrap.clhx;
            //样式控制
            var lw = obj.ctlCss ? (obj.ctlCss.lw||230) : 230,
                th = obj.ctlCss ? (obj.ctlCss.th || 50) : 50,
                openItemH = obj.ctlCss ? (obj.ctlCss.openItemH||40) : 40;
            var ly_Containter = ss.crtDom('div','ly_Containter','',tempContainer,{
                cn:['width','height','paddingLeft','position'],
                cv:['100%','100%',lw+'px','relative']
            })
                .appendDom([
                    //左侧
                    ss.crtDom('div','ly_menu','Slide','',{
                        cn:[
                            'width','height','lineHeight',
                            'backgroundColor','position','top','left','color','textAlign'
                        ],
                        cv:[
                            lw+'px',_height,_height,
                            '#eeeeee','absolute','0px','0px','rgb(49, 70, 89)','center'
                        ]
                    }),
                    //内容
                    ss.crtDom('div','ly_content','','',{
                        cn:['height','width'],
                        cv:[obj.el?obj.el.offsetHeight+'px':ss.paraWrap.clhx,'100%']
                    })
                        .appendDom([
                            //内容_header头部
                            ss.crtDom('div','ly_header','','',{
                                cn:['width','height','borderBottom','padding','lineHeight','position'],
                                cv:['100%',th+'px','1px solid #ccc','0px 15px',th+'px','relative']
                            })
                                .appendDom(function(dom){
                                    ss.crtDom('img','','',dom,{
                                        cn:['width','verticalAlign','cursor','marginBottom'],
                                        cv:['30px','middle','pointer','4.5px'],
                                        an:['src','title'],
                                        av:['./assets/images/logo.png','ssui']
                                    },[
                                        'click',function(){
                                            window.location.href = 'http://47.107.154.57';
                                        }
                                    ])
                                    ss.crtDom('span','',ss.svgRepository.f5(14,'#666'),dom,{
                                        cn:['width','height','verticalAlign','cursor','marginLeft','opacity'],
                                        cv:['14px','14px','middle','pointer','20px',.8],
                                        an:['title'],
                                        av:['刷新']
                                    },[
                                            'click',function(){
                                                window.location.href = window.location.href;
                                            }
                                    ]);
                                    //用户显示->(退出|角色切换)
                                    ss.crtDom('span','',obj.platformName||'管理员',dom,{
                                        cn:['fontSize','color','cursor','position','top','right','userSelect'],
                                        cv:['14px','#666','pointer','absolute','0px','45px','none']
                                    },[
                                    	'click',function(dom,e){
                                    		var wrapDom = ss.getDom('.wrap',dom);
                                    		var svgDom = ss.getDom('.svg',dom);
	                                    	var svgH = 20;
                                    		if(dom.getAttribute('ischeck')=='true'){
	                                    		ss.mdfCss(wrapDom,['display','none']);
	                                    		dom.setAttribute('ischeck','false');
	                                    		svgDom.innerHTML = ss.svgRepository.sjDown(svgH,'#666');
                                    		}
                                    		else{
	                                    		ss.mdfCss(wrapDom,['display','block']);
	                                    		dom.setAttribute('ischeck','true');
	                                    		svgDom.innerHTML = ss.svgRepository.sjUp2(svgH,'#666');
                                    		};
		                               		e.stopPropagation();

                                    	}
                                    ])
                                    .appendDom(function(dom){
                                    	var svgH = 20;
                                    	//svg
	                                    ss.crtDom('div','svg',ss.svgRepository.sjDown(svgH,'#666'),dom,{
											cn:['width','height','position','top','right'],
											cv:[svgH+'px',svgH+'px','absolute','20px','-22px']
	                                    });
	                                    //选项
	                                    ss.crtDom('div','wrap','',dom,{
											cn:[
												'border','borderRadius','width','position','top','left','backgroundColor','zIndex','display','overflow'
											],
											cv:[
												'1px solid #ccc','5px','90px','absolute','45px','-8px','#fff',1000,'none','hidden'
											],
											an:['id'],
											av:['_roleWrap']
	                                    })
	                                    .appendDom(function(dom){
	                                    	//权限角色渲染
	                                    	var curRoles = obj['roleData'];
	                                    	for(var f in curRoles){
			                                    ss.crtDom('p','',f,dom,{
													cn:[
														'padding','width','overflow','textOverflow','white','height','lineHeight','textAlign',
														'color','backgroundColor'
													],
													cv:[
														'1px 10px','100%','hidden','ellipsis','nowrap','30px','30px','center',
														f==obj['curRoleName']?'#fff':'#000',f==obj['curRoleName']?'#296799':'#fff'
													],
													an:['iscur'],
													av:[f==obj['curRoleName']?'true':'false']
			                                    },[
			                                    	'mouseover',function(dom){
			                                    		ss.mdfCss(dom,['backgroundColor','#296799','color','#fff']);
			                                    	},
			                                    	'mouseout',function(dom){
			                                    		dom.getAttribute('iscur')=='true' || ss.mdfCss(dom,['backgroundColor','#fff','color','#000']);
			                                    	},
			                                    	'click',function(dom,e){
			                                    		var pDoms = dom.parentNode.children;
			                                    		for(var p=0; p<pDoms.length; p++){
			                                    			ss.mdfCss(pDoms[p],['backgroundColor','#fff','color','#000']);
			                                    			pDoms[p].setAttribute('iscur','false');
			                                    		};
			                                    		ss.mdfCss(dom,['backgroundColor','#296799','color','#fff']);
			                                    		dom.setAttribute('iscur','true');
			                                    		
			                                    		//关闭当前角色弹窗
			                                    		var wrapDom = dom.parentNode;
			                                    		var svgDom = ss.getDom('.svg',dom.parentNode.parentNode);
			                                    		ss.mdfCss(wrapDom,['display','none']);
			                                    		wrapDom.parentNode.setAttribute('ischeck','false');
			                                    		svgDom.innerHTML = ss.svgRepository.sjDown(svgH,'#666');
			                                    		if(pDoms.length>1){
			                                    			obj['switchRole'] && obj['switchRole'](dom.innerHTML);
			                                    		};
			                                    		e.stopPropagation();
			                                    	}
			                                    ])
	                                    	};
		                                    ss.crtDom('p','','退出',dom,{
												cn:['padding','width','overflow','textOverflow','white','height','lineHeight','textAlign'],
												cv:['1px 10px','100%','hidden','ellipsis','nowrap','30px','30px','center']
		                                    },[
		                                        'click',function(dom){
		                                            window.location.href = 'index.html'
		                                        }
		                                    ])
	                                    });
                                    });
                                }),
                            //内容_tab标题
                            ss.crtDom('div','ly_tabTitle','','',{
                                cn:['height','backgroundColor','borderBottom','boxShadow','position','zIndex','paddingLeft'],
                                cv:[openItemH+'px','#fff','none','0px .5px 2px #ccc','relative',999,'80px']
                            }),
                            //内容_ssView
                            ss.crtDom('div','ly_ssView','Content','',{
                                cn:[
                                    'height','lineHeight',
                                    'backgroundColor','padding','overflowX','overflowY','textAlign'
                                ],
                                cv:[
                                    (obj.el?obj.el.offsetHeight:ss.paraWrap.clh)-th-openItemH+'px',(obj.el?obj.el.offsetHeight:ss.paraWrap.clh)-th-30-openItemH+'px',
                                    '#f2f2f2','15px','hidden','auto','center'
                                ]
                            })
                        ])
                ]);
            //dom存储
            self.domWrap['ly_Containter'] = ly_Containter;
            // self.domWrap['ly_menu'] = ss.getDom('.ly_menu',ly_Containter);
            // ss.domWrap['ly_menu'] = ss.getDom('.ly_menu',ly_Containter);
            self.domWrap['ly_content'] = ss.getDom('.ly_content',ly_Containter);
            self.domWrap['ly_header'] = ss.getDom('.ly_header',ly_Containter);
            self.domWrap['ly_tabTitle'] = ss.getDom('.ly_tabTitle',ly_Containter);
            self.domWrap['ly_ssView'] = ss.getDom('.ly_ssView',ly_Containter);
            // ss.domWrap['ly_ssView'] = ss.getDom('.ly_ssView',ly_Containter);

            (obj.el || window.document.body).appendChild(tempContainer);

        },
        //tab标题
        rd_tabTitleFn:function(){
            var self = this,
                obj = self.sourceObj;
            //tab标题_左侧
            var ly_tabTitleL = ss.crtDom('div','ly_tabTitleL','',self.domWrap.ly_tabTitle,{
                cn:['width','height','position','top','left'],
                cv:['80px','100%','absolute','0px','0px']
            })
                .appendDom([
                    //箭头左
                    ss.crtDom('div','',ss.svgRepository.arrow_Rleft(24,'#777'),'',{
                        cn:['width','height','borderRight','display','vertical-align','textAlign','padding-top','cursor'],
                        cv:['40px','100%','1px solid #ccc','inline-block','top','center','8px','pointer']
                    })
                    ,
                    //首页
                    ss.crtDom('div','ly_homeTab',ss.svgRepository.home(20,'#555'),'',{
                        cn:['width','height','borderRight','display','vertical-align','textAlign','padding-top','cursor','position'],
                        cv:['40px','100%','1px solid #ccc','inline-block','top','center','10px','pointer','relative']
                    },[
                        'click',function(){
                            self.lg_clearStatuFn('home');
                            window.location.href = window.location.origin+window.location.pathname+'#home';
                            ss.relation_tabTitleFn('home');//tab栏各项关联menu菜单
                        }
                    ]).appendDom([
                        //提示条
                        ss.crtDom('div','tipWrap','','',{
                            cn:['position','width','height','top','left','backgroundColor','transition'],
                            cv:['absolute','101%','0px','0px','0px','#666','.1s']
                        })
                    ])
                ]);
            //tab标题_右侧
            var ly_tabTitleR = ss.crtDom('div','ly_tabTitleR','',self.domWrap.ly_tabTitle,{
                cn:['height','width','backgroundColor','position'],
                cv:['100%','100%','#fff','relative']
            })
                .appendDom([
                    //下拉
                    ss.crtDom('div','',ss.svgRepository.arrow_down2(20,'#888'),'',{
                        cn:['width','height','borderLeft','display','vertical-align','textAlign','padding-top','cursor','position','right','top','backgroundColor','zIndex'],
                        cv:['40px','100%','1px solid #ccc','inline-block','top','center','11px','pointer','absolute','0px','0px','#fff',999],
                        an:['type'],
                        av:['position']
                    })
                    ,
                    //箭头右
                    ss.crtDom('div','',ss.svgRepository.arrow_RRight(24,'#777'),'',{
                        cn:['width','height','borderLeft','display','vertical-align','textAlign','padding-top','cursor','position','right','top','backgroundColor','zIndex'],
                        cv:['40px','100%','1px solid #ccc','inline-block','top','center','8px','pointer','absolute','40px','0px','#fff',999],
                        an:['type'],
                        av:['position']
                    })
                    ,
                    //tab栏容器
                    ss.crtDom('ul','ly_tTShow','','',{
                        cn:['height','backgroundColor','overflow'],
                        cv:['40px','#fff','hidden']
                    })
                ]);
            self.domWrap['ly_tabTitleL'] = ss.getDom('.ly_tabTitleL',self.domWrap['ly_Containter']);
            self.domWrap['ly_tabTitleR'] = ss.getDom('.ly_tabTitleR',self.domWrap['ly_Containter']);
            self.domWrap['ly_tTShow'] = ss.getDom('.ly_tTShow',self.domWrap['ly_Containter']);
        },
        //tab标题显示
        lg_shwoTtFn:function(tTName,tTTxt,self){
            var self = self,
                obj = self.sourceObj;
            if(self.tabTitleWrap.indexOf(tTTxt)===-1){  
                self.tabTitleWrap.push(tTTxt);
                var liDom = ss.crtDom('li','tTShowLi','',self.domWrap.ly_tTShow,{
                    cn:['height','line-height','borderRight','display','vertical-align','backgroundColor','color','transition','position'],
                    cv:['40px','40px','1px solid #ccc','inline-block','top','#fff','#555','all .1s','relative'],
                    an:['txt'],
                    av:[tTTxt]
                },[
                    'mousemove',function(dom){
                        dom.getAttribute('isClick')!='true' && (
                            dom.style.backgroundColor = '#f2f2f2',
                            ss.getDom('.tipWrap',dom).style.height = '3px'
                        )
                    },
                    'mouseout',function(dom){
                        dom.getAttribute('isClick')!='true' && (
                            dom.style.backgroundColor = '#fff',
                            ss.getDom('.tipWrap',dom).style.height = '0px'
                        )
                    },
                    'click',function(dom){
                        self.lg_clearStatuFn(dom);//清除其它tab栏状态
                        window.location.href = window.location.origin+window.location.pathname+'#'+dom.getAttribute('txt');
                        ss.relation_tabTitleFn(dom.getAttribute('txt'));//tab栏各项关联menu菜单
                    }
                ]).appendDom([
                    //提示条
                    ss.crtDom('div','tipWrap','','',{
                        cn:['position','width','height','top','left','backgroundColor','transition'],
                        cv:['absolute','101%','0px','0px','0px','#666','.1s']
                    })
                    ,
                    //名称
                    ss.crtDom('span','',tTName,'',{
                        cn:['display','cursor','paddingLeft','userSelect'],
                        cv:['inline-block','pointer','10px','none']
                    }),
                    //叉图标
                    ss.crtDom('div','closeWrap','','',{
                        cn:['display','paddingRight','cursor','position','zIndex'],
                        cv:['inline-block','10px','pointer','relative',99]
                    }).appendDom([
                        ss.crtDom('span','close',ss.svgRepository.close(14,'#666'),'',{
                            cn:['display','width','height','position','marginTop','verticalAlign','marginBottom','marginLeft'],
                            cv:['inline-block','14px','14px','relative','5px','middle','6px','5px']
                        })
                    ])
                ]);
                //svg绑定事件
                var svgDom = liDom.querySelector('svg');
                svgDom.addEventListener('mousemove',function(){
                    var paths = this.querySelectorAll('path');
                    for(var a=0; a<paths.length; a++){
                        paths[a].setAttribute('fill','red');
                    }
                },false);
                svgDom.addEventListener('mouseout',function(){
                    var paths = this.querySelectorAll('path');
                    for(var a=0; a<paths.length; a++){
                        paths[a].setAttribute('fill','#666');
                    }
                },false);
                svgDom.addEventListener('click',function(e){
                    var curLi = this.parentNode.parentNode.parentNode;
                    curLi.parentNode.removeChild(curLi);//移除li元素
                    self.tabTitleWrap.splice(self.tabTitleWrap.indexOf(curLi.getAttribute('txt')),1);//存储数组中移除
                    //若是移除与当前的hash值相同，则跳转到首页
                    if(curLi.getAttribute('txt') === location.hash.slice(1)){
                        self.lg_clearStatuFn('home');  
                        window.location.href = window.location.origin+window.location.pathname+'#home';
                        ss.relation_tabTitleFn('home');//tab栏各项关联menu菜单
                    }
                    e.stopPropagation();
                },false);
                self.tabDomWrap[tTTxt] = liDom;
                self.lg_clearStatuFn(liDom);
            }
            else{
                self.lg_clearStatuFn(self.tabDomWrap[tTTxt]);
            }

        },
        //tab标题清空状态
        lg_clearStatuFn : function(curLi){
            var self = this,
                obj = self.sourceObj;
            if(self.domWrap && self.domWrap['ly_tTShow']){
                var lis = self.domWrap['ly_tTShow'].children;
                for(var b=0; b<lis.length; b++){
                    lis[b].style.backgroundColor = '#fff';
                    ss.getDom('.tipWrap',lis[b]).style.height = '0px';
                    lis[b].setAttribute('isClick','false');

                    var homeDom = ss.getDom('.ly_homeTab');
                    homeDom.style.backgroundColor = '#fff';
                    ss.getDom('.tipWrap',homeDom).style.height = '0px';
                    homeDom.setAttribute('isClick','false');
                }
                if(typeof  curLi === 'string'){
                    var homeDom = ss.getDom('.ly_homeTab');
                    homeDom.style.backgroundColor = '#f2f2f2';
                    ss.getDom('.tipWrap',homeDom).style.height = '3px';
                    homeDom.setAttribute('isClick','true');
                }
                else{
                    curLi.style.backgroundColor = '#f2f2f2';
                    ss.getDom('.tipWrap',curLi).style.height = '3px';
                    curLi.setAttribute('isClick','true');
                }
            }

        },
        //点击字段存储
        lg_saveTxtFn:function(){
            var menuData = ss.options.menuData || ss.error('未配置菜单数据！'),
                tempData = [];
            var recursionParaFn = function(menuData){
                if(menuData.heeler.length!=0){
                    for(var a=0; a<menuData.heeler.length; a++){
                        menuData.heeler[a].txt && tempData.push(menuData.heeler[a].txt);
                        recursionParaFn(menuData.heeler[a]);
                    }
                }
            }
            recursionParaFn(menuData);
            ss.options['clickTxts'] = tempData.concat('home');
        },

    };

    out('layout',function(obj){
        return new ss_layout(obj);
    });
})