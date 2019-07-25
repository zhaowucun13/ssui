ss.set(function(out){
    function Limits(obj){
        this.sourceObj = obj;
        this.domWrap = {};//dom存储容器
        this.scope = {};//数据存储容器
        this.init();//初始化
    };
    Limits.prototype = {
        constructor:Limits,//构造函数
        //初始化
        init:function(){
            var self = this,obj = self.sourceObj;
            self.configBeforeRenderFn();
            self.rd_layout();//总容器
            self.rd_itemsFn();//各项
        },
        //----| 渲染前定义 |----
        configBeforeRenderFn:function(){
            var self = this,obj = self.sourceObj;
            //领导和手下项的别名
            self.scope['_leader'] = 'leader';
            self.scope['_heeler'] = 'heeler';
            //id的别名
            self.scope['_id'] = 'id';
            //勾选的id
            self.scope['checkArr'] = [];
            //图标统一
            self.scope['commonH'] = 17;
            self.scope['commonColor'] = '#666';//未选颜色
            self.scope['common_uColor'] = '#f60';//选中颜色
            self.scope['common_bColor'] = '#ccc';//半选中颜色
            //勾选状态：selected(全选allSel 未选unSel 半选halfSel)
            self.scope['selected'] = {
                allSel:ss.svgRepository['checkboxIcon'](self.scope['commonH'],self.scope['common_uColor']),
                unSel:ss.svgRepository['uncheckboxIcon'](self.scope['commonH'],self.scope['commonColor']),
                halfSel:ss.svgRepository['checkboxIcon'](self.scope['commonH'],self.scope['common_bColor'])
            };
            //展开状态：showHidden(加号all 减号minus)
            self.scope['showStatu'] = {
                add:ss.svgRepository['add'](self.scope['commonH'],self.scope['commonColor']),
                minus:ss.svgRepository['minus'](self.scope['commonH'],self.scope['commonColor'])
            };
        },
        //----| 渲染 |----
        //总容器
        rd_layout:function(){
            var self = this,obj = self.sourceObj;
            var mulSleDom = ss.crtDom('div','_mulSle','',obj.appendTo,{
                cn:['border','borderRadius','overflow'],
                cv:['1px solid #ddd','3px','hidden']
            });
            self['domWrap']['mulSleDom'] = mulSleDom;
        },
        //递归各项
        rd_itemsFn:function(){
            var self = this,obj = self.sourceObj;
            var _leader = self.scope._leader,
                _heeler = self.scope._heeler;
            var _count = 0;
            //递归函数创建
            function recursionFn(crtData,appendTo,_count){
                var curData = crtData.heeler;
                var _count = _count + 1;
                //不存在子项或长度为0，则返回
                if(!curData || curData.length==0){
                    return;
                };
                //判断是否需要创建,根据_heeler值
                for(var a=0; a<curData.length; a++){
                    if(curData[a].type=='1'){  
                        //文件夹
                        var leaderWrap = ss.crtDom('div','leaderWrap','',appendTo,{
                            cn:[],
                            cv:[],
                            an:['_count'],
                            av:[_count]
                        })
                        .appendDom(function(dom){
                            var leader_dom = ss.crtDom('div','leader_dom','',dom,{
                                cn:[
                                    'borderBottom','height','lineHeight','boxSizing','paddingLeft',
                                    'display','userSelect'
                                ],
                                cv:[
                                    '1px solid #ddd','40px','40px','border-box',20*_count+'px',
                                    _count==1?'block':'none','none'
                                ],
                                an:['_count'],
                                av:[_count]
                            },[
                                'mouseover',function(dom){
                                    ss.mdfCss(dom,['backgroundColor','#f5f5f5']);
                                },
                                'mouseout',function(dom){
                                    ss.mdfCss(dom,['backgroundColor','#fff']);
                                }
                            ])
                            .appendDom(function(dom){
                                //加号 || 勾选
                                ['add','uncheckboxIcon'].forEach(function(item){
                                    //判断勾选的状态 selected: 全选1 未选2 半选3
                                    var curSvg = '';
                                    var isTF = false;
                                    if(item=='uncheckboxIcon'){
                                        switch( String(curData[a].selected) ){
                                            case '1':
                                                curSvg = self.scope.selected.allSel;
                                                isTF = true;
                                                break;
                                            case '2':
                                                curSvg = self.scope.selected.unSel;
                                                break;
                                            case '3':
                                                curSvg = self.scope.selected.halfSel;
                                                break;
                                            default:
                                                curSvg = self.scope.selected.unSel;
                                        }
                                        //存在新增类型，就不设置默认值
                                        obj.isNew && (isTF=false,curSvg=self.scope.selected.unSel);    
                                    }   
                                    else if(item=='add'){
                                        curSvg = self.scope.showStatu.add;
                                    }
                                    ss.crtDom('div',item+'Dom',curSvg,dom,{
                                        cn:[
                                            'display','width','height','position','verticalAlign','marginBottom',
                                            'marginRight'
                                        ],
                                        cv:[
                                            'inline-block',self.scope['commonH']+'px',self.scope['commonH']+'px','relative','middle','5px',
                                            item=='add'?'3px':'5px'
                                        ],
                                        an:['type','ischeck'],
                                        av:[item , isTF?'true':'false']
                                    },[
                                        'click',function(dom){
                                            dom.getAttribute('type')=='add'
                                                ?
                                            self.lg_leaderCliFn(dom)
                                                :
                                            self.lg_leaderCheckFn(dom);
                                        }
                                    ]);
                                });
                                //文字
                                ss.crtDom('span','txtDom',curData[a][_leader],dom);
                            });
                        });
                        recursionFn(curData[a],leaderWrap,_count);
                    }
                    else if(curData[a].type=='2'){
                        //文件
                        ss.crtDom('div','item_dom','',appendTo,{
                            cn:[
                                'borderBottom','height','lineHeight','boxSizing','paddingLeft',
                                'display','userSelect'
                            ],
                            cv:[
                                '1px solid #ddd','40px','40px','border-box',20*_count+'px',
                                'none','none'
                            ],
                            an:['_count','_id'],
                            av:[_count, curData[a][self.scope['_id']] ]
                        },[
                            'mouseover',function(dom){
                                ss.mdfCss(dom,['backgroundColor','#f5f5f5']);
                            },
                            'mouseout',function(dom){
                                ss.mdfCss(dom,['backgroundColor','#fff']);
                            }
                        ])
                        .appendDom(function(dom){
                            var commonH = 17;
                            //勾选
                            ['uncheckboxIcon'].forEach(function(item){
                                var curSvg = '';//判断svg的状态
                                var isTF = false;//判断是否需要添加状态
                                switch( String(curData[a].selected) ){
                                    case '1':
                                        curSvg = self.scope.selected.allSel;
                                        isTF = true;
                                        break;
                                    case '2':
                                        curSvg = self.scope.selected.unSel;
                                        break;
                                    case '3':
                                        curSvg = self.scope.selected.halfSel;
                                        break;
                                    default:
                                        curSvg = self.scope.selected.unSel;
                                };
                                //存在新增类型，就不设置默认值
                                obj.isNew && (isTF=false,curSvg=self.scope.selected.unSel);
                                //对id选择容器进行添加(保证状态为1，且isNew状态为真)
                                isTF && (self.scope['checkArr'].push(curData[a][self.scope['_id']]));

                                ss.crtDom('div',item+'Dom',curSvg,dom,{
                                    cn:['display','width','height','position','marginRight','verticalAlign','marginBottom'],
                                    cv:['inline-block',commonH+'px',commonH+'px','relative','5px','middle','5px'],
                                    an:['_id','ischeck'],
                                    av:[ curData[a][self.scope['_id']] , isTF?'true':'false']
                                },[
                                    'click',function(dom){
                                        self.lg_heelerCheckFn(dom);
                                    }
                                ]);

                            });
                            //文字
                            ss.crtDom('span','txtDom',curData[a].name,dom);
                        })
                    }
                };
            };
            recursionFn({heeler:obj.data},self['domWrap']['mulSleDom'],_count);
        },
        //----| 逻辑 |----        
        //领导项leader_加号点击
        lg_leaderCliFn:function(dom){
            var self = this,obj = self.sourceObj;
            if(dom.getAttribute('issel')=='true'){
                //已点击
                self.lg_leaderCli_sonSH(dom,'true');
                dom.innerHTML = ss.svgRepository.add(self.scope['commonH'],self.scope['commonColor']);
                ss.mdfAttr(dom,['issel','false']);
            }
            else{
                //未点击
                self.lg_leaderCli_sonSH(dom,'false');
                dom.innerHTML = ss.svgRepository.minus(self.scope['commonH'],self.scope['commonColor']);
                ss.mdfAttr(dom,['issel','true']);
            };
        },
        //领导项leader_加号点击--子代元素显示隐藏
        lg_leaderCli_sonSH:function(dom,type){
            var self = this,obj = self.sourceObj;
            var leader_dom  = dom.parentNode.parentNode;
            var son_item_dom = self.util_getSonClassDom(leader_dom,'item_dom'),
                son_leader_dom = self.util_getSonSonClassDom(leader_dom,'leaderWrap','leader_dom');
            var all_item_dom = self.util_getDomArr(leader_dom.querySelectorAll('.item_dom')),
                all_leader_dom = self.util_getDomArr(leader_dom.querySelectorAll('.leader_dom')),
                all_add_dom = self.util_getDomArr(leader_dom.querySelectorAll('.addDom'));
            if(type=='true'){
                //所有项隐藏
                all_item_dom.concat(all_leader_dom).forEach(function(item){
                    ss.mdfCss(item,['display','none']);
                });
                //显示当前项
                ss.mdfCss(dom.parentNode,['display','block']);
                //重置加号状态
                all_add_dom.forEach(function(item){
                    item.innerHTML = ss.svgRepository.add(self.scope['commonH'],self.scope['commonColor']);
                    ss.mdfAttr(item,['issel','false']);
                });
            }
            else if(type=='false'){
                son_item_dom.concat(son_leader_dom).forEach(function(item){
                    ss.mdfCss(item,['display','block']);
                });
            };
        },
        //领导项leader_勾选点击
        lg_leaderCheckFn:function(dom){
            var self = this,obj = self.sourceObj;
            if(dom.getAttribute('ischeck')=='true'){
                //已点击
                dom.innerHTML = ss.svgRepository.uncheckboxIcon(self.scope['commonH'],self.scope['commonColor']);
                ss.mdfAttr(dom,['ischeck','false']);
                self.lg_dpCheckUiFn(dom,'true');
            }
            else{
                //未点击
                dom.innerHTML = ss.svgRepository.checkboxIcon(self.scope['commonH'],self.scope['common_uColor']);
                ss.mdfAttr(dom,['ischeck','true']);
                self.lg_dpCheckUiFn(dom,'false');
            };
            self.lg_juegeFatherStatuFn(dom,'leader');//更新父级的勾选状态
        },
        //领导层leader_勾选的ui控制
        lg_dpCheckUiFn:function(dom,type){
            var self = this,obj = self.sourceObj;
            var leader_dom  = dom.parentNode.parentNode;
            var all_item_dom = self.util_getDomArr(leader_dom.querySelectorAll('.item_dom')),
                all_leader_dom = self.util_getDomArr(leader_dom.querySelectorAll('.leader_dom')),
                all_uncheckboxIcon_Dom = self.util_getDomArr(leader_dom.querySelectorAll('.uncheckboxIconDom'));
            var checkIds = [];
            if(type=='true'){
                //重置勾选状态
                all_uncheckboxIcon_Dom.forEach(function(item){
                    item.innerHTML = ss.svgRepository.uncheckboxIcon(self.scope['commonH'],self.scope['commonColor']);
                    ss.mdfAttr(item,['ischeck','false']);
                    item.getAttribute('_id') && checkIds.push( Number(item.getAttribute('_id')) );
                });
                self.lg_dpCheckIdFn(checkIds,'splice');
            }
            else if(type=='false'){
                //重置勾选状态
                all_uncheckboxIcon_Dom.forEach(function(item){
                    item.innerHTML = ss.svgRepository.checkboxIcon(self.scope['commonH'],self.scope['common_uColor']);
                    ss.mdfAttr(item,['ischeck','true']);
                    item.getAttribute('_id') && checkIds.push( Number(item.getAttribute('_id')) );
                });
                self.lg_dpCheckIdFn(checkIds,'add');
            }
        },
        //领导层leader_勾选项id的添加和移除
        lg_dpCheckIdFn:function(ids,type){
            var self = this,obj = self.sourceObj;
            var checkArr = self.scope['checkArr'];
            if(type=='add'){
                //加
                var tempArr = [];
                var curCheckArr = self.scope['checkArr'],
                    ids = ids;
                for(var a=0; a<ids.length; a++){
                    curCheckArr.indexOf(ids[a])!=-1 || tempArr.push(ids[a]);
                };
                self.scope['checkArr'] = curCheckArr.concat(tempArr);
            }
            else if(type=='splice'){
                //剔除
                var tempArr = [];
                var curCheckArr = self.scope['checkArr'];
                for(var a=0; a<curCheckArr.length; a++){
                    ids.indexOf(curCheckArr[a])!=-1 || tempArr.push(curCheckArr[a]);
                };
                self.scope['checkArr'] = tempArr;
            };
            console.log(self.scope['checkArr']);
        },
        //手下项heeler_勾选点击
        lg_heelerCheckFn:function(dom){
            var self = this,obj = self.sourceObj;
            if(dom.getAttribute('ischeck')=='true'){
                //已点击
                dom.innerHTML = ss.svgRepository.uncheckboxIcon(self.scope['commonH'],self.scope['commonColor']);
                ss.mdfAttr(dom,['ischeck','false']);
                self.lg_dpCheckId(dom.getAttribute('_id'),'splice');
            }
            else{
                //未点击
                dom.innerHTML = ss.svgRepository.checkboxIcon(self.scope['commonH'],self.scope['common_uColor']);
                ss.mdfAttr(dom,['ischeck','true']);
                self.lg_dpCheckId(dom.getAttribute('_id'),'add');
            };
            self.lg_juegeFatherStatuFn(dom,'item');//更新父级的勾选状态
        },
        //手下项heeler_勾选id的添加和移除
        lg_dpCheckId:function(id,type){
            var self = this,obj = self.sourceObj;
            var checkArr = self.scope['checkArr'];
            if(type=='add'){
                //加
                checkArr.push(Number(id));
            }
            else if(type=='splice'){
                //剔除
                checkArr.splice(checkArr.indexOf(Number(id)),1);
            };
            console.log(self.scope['checkArr']);
        },
        //手下项heeler_判断->更新父级勾选框的状态
        lg_juegeFatherStatuFn:function(dom,type,leader3Count){
            var self = this,obj = self.sourceObj;
            //获取当前item_dom项目，根据状态判断
            var item_dom  =  type=='item' ? dom.parentNode.parentNode : dom.parentNode.parentNode.parentNode;
            if(!self.util_getSonClassDom(item_dom,'leader_dom')[0]){
                return;
            }
            var son_item_dom = self.util_getSonClassDom(item_dom,'item_dom'),
                son_leader_checkDom = self.util_getSonClassDom(item_dom,'leader_dom')[0].querySelector('.uncheckboxIconDom');
            //是否存在item和leader
            var isitem = false,isleader = false;
            //所有的item判断
            var isTF = true;//标识
            var checkCount = 0;//选中次数
            son_item_dom && son_item_dom.length!=0 ?(
                (function(){
                    for(var a=0; a<son_item_dom.length; a++){
                        if(son_item_dom[a].querySelector('.uncheckboxIconDom').getAttribute('ischeck')!='true'){
                            isTF = false;
                        }
                        else{
                            checkCount = checkCount+1;
                        }
                    };
                }())
            )
                :
            (isTF = false,isitem = true);

            //所有的leaderWrap判断
            //存在半数状态的leader
            var _leader3 = 0;
            var son_leaderWrap = self.util_getSonClassDom(item_dom,'leaderWrap');
            var isTF2 = true;//标识
            var checkCount2 = 0;//leaderWrap选中次数
            son_leaderWrap && son_leaderWrap.length!=0 ?
            (function(){
                for(var b=0; b<son_leaderWrap.length; b++){
                    if(son_leaderWrap[b].querySelector('.leader_dom').querySelector('.uncheckboxIconDom').getAttribute('ischeck')!='true'){
                        isTF2 = false;
                    }
                    else{
                        checkCount2 = checkCount2+1;
                    };
                    if(son_leaderWrap[b].querySelector('.leader_dom').querySelector('.uncheckboxIconDom').getAttribute('selected')=='3'){
                        _leader3 = _leader3+1;
                    };
                };
            }())
                :
            (isTF2 = false,isleader = true);   

            //获取当前全选的状态
            var endStatu = '';
            if(isleader){
                //没有leader项
                (isTF && checkCount>0) ? (endStatu=1)
                :
                ( 
                    !isTF && checkCount>0 ? (endStatu=2) : (endStatu=3)
                )

            }
            else if(isitem){
                //没有item项
                (isTF2 && checkCount2>0) ? (endStatu=1)
                :
                ( 
                    !isTF2 && checkCount2>0 ? (endStatu=2) : (endStatu=3)
                )
            }
            else if(!isleader && !isitem){
                //两者皆有
                (isTF2 && checkCount2>0 && isTF && checkCount>0) ? (endStatu=1)
                :
                ( 
                    !isTF2 && checkCount2==0 && !isTF && checkCount==0 ? (endStatu=3) : (endStatu=2)
                )
            };
            //三种状态：全选 半选  未选
            if(endStatu==1){
                ss.mdfAttr(son_leader_checkDom,['ischeck','true','selected','1']);
                son_leader_checkDom.innerHTML = ss.svgRepository.checkboxIcon(self.scope['commonH'],self.scope['common_uColor']);
                self.lg_juegeFatherStatuFn(son_leader_checkDom,'leader',_leader3);
            }
            else if(endStatu==2){
                ss.mdfAttr(son_leader_checkDom,['ischeck','false','selected','3']);//半选状态
                son_leader_checkDom.innerHTML = ss.svgRepository.checkboxIcon(self.scope['commonH'],self.scope['common_bColor']);
                self.lg_juegeFatherStatuFn(son_leader_checkDom,'leader',_leader3);

            }
            else if(endStatu==3){
                ss.mdfAttr(son_leader_checkDom,['ischeck','false','selected','2']);
                son_leader_checkDom.innerHTML = ss.svgRepository.uncheckboxIcon(self.scope['commonH'],self.scope['commonColor']);
                //对冒泡领导层半选择的控制
                if(_leader3&&_leader3>0&&self.scope.checkArr!=0){
                    son_leader_checkDom.innerHTML = ss.svgRepository.checkboxIcon(self.scope['commonH'],self.scope['common_bColor']),
                    ss.mdfAttr(son_leader_checkDom,['ischeck','false','selected','3'])
                }
                self.lg_juegeFatherStatuFn(son_leader_checkDom,'leader',_leader3);
            }
        },
        //----| 方法 |----        
        util_getSonClassDom:function(dom,className){
            var self = this,obj = self.sourceObj;
            var childs = dom.children;
            var tempArr = [];
            for(var a=0; a<childs.length; a++){
                childs[a].className ==  className && (
                    tempArr.push(childs[a])
                )
            };
            return tempArr;
        },
        util_getSonSonClassDom:function(dom,className,sonClassName){
            var self = this,obj = self.sourceObj;
            var childs = dom.children;
            var tempArr = [],endArr = [];
            for(var a=0; a<childs.length; a++){
                childs[a].className ==  className && (
                    tempArr.push(childs[a])
                )
            };
            tempArr.forEach(function(item){
                var curChilds = item.children;
                for(var b=0; b<curChilds.length; b++){
                    curChilds[b].className ==  sonClassName && (
                        endArr.push(curChilds[b])
                    )
                };
            });
            return endArr;
        },
        util_getDomArr:function(domObj){
            var self = this,obj = self.sourceObj;
            var tempArr = [];
            for(var a=0; a<domObj.length; a++){
                tempArr.push(domObj[a]);
            };
            return tempArr;
        },
    };

    out('limits',function(obj){
        return new Limits(ob)
    })

})






















