/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out){
	//备注：依赖init.css样式
    function DocNavMenu(obj) {
        this.sourceObj = obj;
		this.domWrap = {};//dom容器
        this.scope = {};//scope容器
        this.init();//初始化
    }
    DocNavMenu.prototype = {
        constructor:DocNavMenu,
        //初始化
		init:function(){
            this.rd_contianerFn();//渲染整体容器
            var curHash = ss.getCurHash();
            curHash && this.lg_defaultValSettingFn(curHash);//存在默认值->渲染
		},
        //| 渲染  | 
        //渲染-整体容器
        rd_contianerFn:function(){
            var self = this,obj = self.sourceObj;
            //虚拟dom容器
            var frameDomWrap = document.createDocumentFragment();
            //最外层容器
            var docNavMenuWrap = ss.crtDom('div','ss_docNavMenuWrap','',frameDomWrap,
                {
                    cn:['padding','height','position'],
                    cv:['15px','100%','absolute']
                }
            );
            var initCount = 0;//起初层级
            //递归创建函数
            var recursionFn = function(data,fatherDom,count){
                var curHeelers = data.heeler;
                var COUNT = count;
                if(!curHeelers || !curHeelers.length) return;
                for(var i=0,iLen=curHeelers.length; i<iLen; i++){
                    ss.crtDom('div','ss_docmn_itemWrap_'+COUNT,'',fatherDom,{an:['ss_docmn_count'],av:[COUNT]})
                    .appendDom(function(dom){
                        self.rd_itemsFn({
                            data:curHeelers[i],
                            count:COUNT,
                            el:dom,
                            index:i,
                            leg:iLen
                        });//渲染各项
                        recursionFn(curHeelers[i],dom,COUNT+1);
                    });
                };
            };
            recursionFn(obj.data,docNavMenuWrap,initCount);//调用
            obj.el.appendChild(frameDomWrap);//添加虚拟dom
        },
        //整体容器-渲染各项总汇
        rd_itemsFn:function(obj){
            var self = this;
            obj.count===0 ?
                self.rd_itemsFirstFn(obj)//首项
                :
                obj.count===1?
                    self.rd_itemsSecondFn(obj)
                    :
                    self.rd_itemsOtherFn(obj);
        },
        //渲染各项-首项
        rd_itemsFirstFn:function(obj){  
            var self = this;
            //首项
            var curData = obj.data;
            var curCount = obj.count;
            ss.mdfCss(obj.el,['height','35px','overflow','hidden'])
            ss.crtDom('div','ss_docmn_txt','',obj.el,{
                cn:['fontSize','height','lineHeight','cursor','userSelect'],
                cv:['16px','35px','35px','pointer','none']
            },[
                'click',function(dom){
                    self.lg_cliShowFirstFn(dom);//首项点击
                }
            ])
            .appendDom(function(dom){
                //三角符号
                ss.crtDom('p','svg_dar',ss.svgRepository.docArrowR(14,'#8d8d8d'),dom,{
                    cn:[
                        'display','verticalAlign','position','width','height','marginRight','marginBottom',
                        'color','transform','transition'
                    ],
                    cv:[
                        'inline-block','middle','relative','14px','14px','10px','2px',
                        '#364049','rotate(-90deg)','all .3s'
                    ]
                });
                //首项文字
                ss.crtDom('span','',curData.leader,dom);
            })
        },
        //渲染各项-第二项
        rd_itemsSecondFn:function(obj){
            var self = this;
            var curData = obj.data;
            var curCount = obj.count;
            ss.mdfCss(obj.el,['paddingLeft','40px']);
            ss.crtDom('div','ss_docmn_txt','',obj.el,{
                cn:['fontSize','height','lineHeight','cursor','userSelect'],
                cv:['14px','33px','33px','pointer','none']
            })            
            .appendDom(function(dom){
                //文字
                ss.crtDom('span','',curData.leader,dom);
            })
        },
        //渲染各项-其它项
        rd_itemsOtherFn:function(obj){
            var self = this;
            var curData = obj.data;
            var curCount = obj.count;
            ss.mdfCss(obj.el,['paddingLeft','20px','height','33px','overflow','hidden','transition','all .3s']);
            var txtDom = ss.crtDom('div','ss_docmn_txtWrap','',obj.el,{
                cn:['fontSize','height','lineHeight','cursor','position'],
                cv:['14px','33px','33px','pointer','relative']
            },[
                'mouseover',function(dom){
                    ss.mdfCss(dom,['backgroundColor','#eff2f4']);
                },
                'mouseout',function(dom){
                    ss.mdfCss(dom,['backgroundColor','white'])
                },
                'click',function(dom){
                    dom.querySelector('.svg_dar')?
                        self.lg_cliShowFn(dom)//带三角的点击事件            
                        :
                        self.lg_selectedTxtFn(dom);//点击选中
                }
            ])            
            .appendDom(function(dom){
                //文字
                ss.crtDom('span','',curData.leader,dom,{
                    cn:['userSelect'],cv:['none'],
                    an:['ss_docmn_txt'],
                    av:[curData.txt]
                });
                //满足存在子项条件 -> 创建三角符号
                curData.heeler && curData.heeler.length && (
                    ss.crtDom('p','svg_dar',ss.svgRepository.docArrowR(14,'#8d8d8d'),dom,{
                        cn:[
                            'display','verticalAlign','position','width','height','marginLeft','marginBottom',
                            'color','transform','transition'
                        ],
                        cv:[
                            'inline-block','middle','relative','14px','14px','10px','2px',
                            '#364049','rotate(-90deg)','all .3s'
                        ]
                    })
                );
            });
            self.rd_itemsOtherLineFn(txtDom,obj);//穿线
        },
        //渲染各项-其它项-穿线
        rd_itemsOtherLineFn:function(dom,obj){
            var self = this;
            //左边线
            ss.crtDom('p','ss_docmn_line','',dom,{
                cn:['position','top','left','width','borderLeft','height'],
                cv:['absolute','0px','-12px','5px','1px solid #e7e7eb','100%']
            })
            .appendDom(function(dom){
                //右中线
                ss.crtDom('span','','',dom,{
                    cn:['position','top','width','left','height','borderTop'],
                    cv:['absolute','16px','6px','0px','10px','1px solid #e7e7eb']
                });
                if(obj.index===obj.leg-1){
                    //创建遮挡方块
                    ss.crtDom('span','','',dom,{
                        cn:['position','top','width','left','height','backgroundColor'],
                        cv:['absolute','17px','6px','-3px','17px','#fff']
                    });
                }
            });
        },
        //| 逻辑  |
        //逻辑-首项展开
        lg_cliShowFirstFn:function(dom,type){
            var self = this;
            var curItemWrapDom = type==='first'?dom:dom.parentNode;
            ss.mdfCss(curItemWrapDom,['transition','all .3s','overflow','hidden']);
            if(dom.getAttribute('isopen')==='true'){
                //关闭
                ss.mdfCss(curItemWrapDom,['height','35px']);
                ss.mdfCss(dom.querySelector('.svg_dar'),['transform','rotate(-90deg)']);
                ss.mdfAttr(dom,['isopen','false']);
            }
            else{
                //特殊性：三项内容全部展示(参考小程序ui)
                var curThreeDom = curItemWrapDom.querySelectorAll('[ss_docmn_count="1"]');
                ss.mdfCss(dom.querySelector('.svg_dar'),['transform','rotate(0deg)']);
                ss.mdfAttr(dom,['isopen','true']);
                //第二次展开时，则存在属性curh,以该值为高度
                var _curh = curItemWrapDom.getAttribute('curh');
                if(_curh){
                    ss.mdfCss(curItemWrapDom,['height',_curh+'px']);
                    return;
                };
                //第一次展开，赋值高度和属性,
                var _endThreeH = 0;
                for(var i=0,iLen=curThreeDom.length; i<iLen; i++){
                    _endThreeH = _endThreeH + curThreeDom[i].children.length*33;
                };
                _endThreeH = _endThreeH + 35;
                ss.mdfCss(curItemWrapDom,['height',_endThreeH+'px']);
                ss.mdfAttr(curItemWrapDom,['curh',_endThreeH]);
            };
        },
		//逻辑-其他项展开
        lg_cliShowFn:function(dom,type){
            var self = this;
            var curItemWrapDom = type=='third'?dom:dom.parentNode;
            var curLineDom = dom.querySelector('.ss_docmn_line');
            ss.mdfCss(curLineDom,['transition','all .3s']);
            if(dom.getAttribute('isopen')==='true'){
                ss.mdfCss(curItemWrapDom,['height','33px']);
                ss.mdfCss(curLineDom,['height','33px']);
                ss.mdfCss(dom.querySelector('.svg_dar'),['transform','rotate(-90deg)']);
                ss.mdfAttr(dom,['isopen','false']);
                //第二次展开时，则存在属性curh,以该值为高度
                var _curh = curItemWrapDom.getAttribute('curh');
                var _endH;
                _curh?
                    ( _endH = Number(_curh)-33 )
                    :
                    (_endH = (curItemWrapDom.children.length-1)*33 );
                self.lg_bubbleResetFn(dom,_endH,'mul');
            }
            else{
                ss.mdfCss(dom.querySelector('.svg_dar'),['transform','rotate(0deg)']);
                ss.mdfAttr(dom,['isopen','true']);
                //第二次展开时，则存在属性curh,以该值为高度
                var _curh = curItemWrapDom.getAttribute('curh');
                if(_curh){
                    ss.mdfCss(curItemWrapDom,['height',_curh+'px']);
                    self.lg_bubbleResetFn(dom,Number(_curh)-33,'add');
                    ss.mdfCss(curLineDom,['height',Number(_curh)+'px']);//线跟随增加
                    return;//->return
                };
                ss.mdfCss(curItemWrapDom,['height',curItemWrapDom.children.length*33+'px']);
                ss.mdfCss(curLineDom,['height',curItemWrapDom.children.length*33+'px']);//线跟随增加
                self.lg_bubbleResetFn(dom,(curItemWrapDom.children.length-1)*33,'add');
            }
        },
        //逻辑-默认值设置
        lg_defaultValSettingFn:function(curHash){
            var self = this,obj = self.sourceObj;
            var curDefaultVal = curHash;
            //关闭全部项
            var firstWraps = ss.getDomAll('[ss_docmn_count="0"]');
            for(var i=0,iLen=firstWraps.length; i<iLen; i++){
                ss.mdfCss(firstWraps[i],['height','35px','overflow','hidden']);
            };
            //打开默认项
            var defalutTxtDom = ss.getDom('[ss_docmn_txt="'+curDefaultVal+'"]');
            self.lg_defaultValOpenFn(defalutTxtDom);
        },
        //逻辑-默认值设置-打开默认值项
        lg_defaultValOpenFn:function(curDom){
            var self = this,obj = self.sourceObj;
            //递归获取ss_docmn_count==0的dom
            var _dom;
            var recursionFn = function(dom){
                var _parentDom = dom.parentNode;
                if(!_parentDom.getAttribute('ss_docmn_count')) return;//停止递归的条件
                _parentDom.getAttribute('ss_docmn_count')==0 && (_dom=_parentDom);
                recursionFn(_parentDom);
            };
            recursionFn(curDom.parentNode);
            ss.mdfAttr(ss.getDom('.ss_docmn_txt',_dom),['isopen','true']);//重置状态
            self.lg_cliShowFirstFn(_dom,'first');//首项展开

            //若是ss_docmn_count层级>2，则此基础上再展开其它项
            var curParentDom = curDom.parentNode.parentNode;
            if(Number(curParentDom.getAttribute('ss_docmn_count'))>2){
                var _preDom = curParentDom.previousSibling;
                self.lg_cliShowFn(_preDom);//其它项展开
            }
            //高亮当前选择
            ss.mdfCss(curDom,['color','#1aad16']);
            self.domWrap['selTxtDom'] = curDom;
        },
        //逻辑-点击选中
        lg_selectedTxtFn:function(dom){
            var self = this;
            window.location.hash = "/"+dom.querySelector('span').getAttribute("ss_docmn_txt");
            ss.mdfCss(self.domWrap['selTxtDom'],['color','#000']);
            self.domWrap['selTxtDom'] = dom;
            ss.mdfCss(dom,['color','#1aad16']);
        },
        //逻辑-其它项点击-往上重置父级
        lg_bubbleResetFn:function(dom,hVal,type){
            var curCount = dom.parentNode.getAttribute('ss_docmn_count');
            var _parentDom = dom;
            for(var i=Number(curCount); i>=0; i--){
                _parentDom = _parentDom.parentNode;
                var _parentCount = _parentDom.getAttribute('ss_docmn_count');
                if( _parentCount==='1' || _parentCount===curCount) continue;//当项和二项跳出
                var curH = getComputedStyle(_parentDom,false)['height'];//获取样式的高度
                //首项高度重置
                var endH = type==='add'?
                hVal+Number(curH.slice(0,curH.indexOf('p')))
                    :
                Number(curH.slice(0,curH.indexOf('p')))-hVal;
                ss.mdfCss( _parentDom,['height',endH+'px'] );
                ss.mdfAttr(_parentDom,['curh',endH]);
                //对线条处理
                var curLineDom = _parentDom.querySelector('.ss_docmn_txt').querySelector('.ss_docmn_line');
                if(curLineDom && type==='add'){
                    var curH = getComputedStyle(curLineDom,false)['height'];//获取样式的高度
                    ss.mdfCss( curLineDom,['height',hVal+Number(curH.slice(0,curH.indexOf('p')))+'px'] );
                };
            }
        }
    };

    out('docNavMenu',function(obj){
        new DocNavMenu(obj)
    });
})



