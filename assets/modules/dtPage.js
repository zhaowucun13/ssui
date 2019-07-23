/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out){
    var dtPage = {
    	//表格->分页容器
        rd_pageFn:function(self){
            var self = self,obj = self.sourceObj,pageDom =self.domWrap['dtpWrap'];
            //若已存在，进行移除
            var pageSonDom = self.domWrap['productionPage'];
            
            pageSonDom && pageSonDom.parentNode.removeChild(pageSonDom);
            if(pageDom){
                //当前页&总页数
                var currentPage = self.pageData.page,
                    totalPage = self.pageData.totalPage;
                //当前页数
                var curPage = currentPage;
                var preStatus = curPage==1?'not-allowed':'pointer',
                    preTxtStatus = 	curPage==1 ? '#c6c6c6' : '#333';

                var nextStatus = curPage==totalPage?'not-allowed':'pointer',
                    nextTxtStatus = curPage==totalPage?'#c6c6c6':'#333';
                //分页容器
                var productionPageDom = ss.crtDom('div','productionPage','',pageDom,{
                    cn:['height','boxSizing','float','marginTop','marginRight','backgroundColor','marginBottom'],
                    cv:['30px','border-box','right','15px','0px','#fff','10px']
                })
                .appendDom(
                	function(dom){
	                		
	                    //上一页
	                    ss.crtDom('div','','上一页',dom,{
	                            cn:['border','boxSizing','borderRight','width','height','lineHeight','float','textAlign','fontSize','color','cursor','borderTopLeftRadius','borderBottomLeftRadius'],
	                            cv:['1px solid #c6c6c6','border-box','none','68px','30px','28px','left','center','13px',preTxtStatus,preStatus,'3px','3px']
	                        },
	                        [
	                            'click',function(dom){
	                                var curPage = self.pageData.page;
	                                if(Number(curPage)==1){
	                                    return;
	                                }
	                                else{
	                                    self.lg_pageRunFn(Number(curPage)-1);
	                                }
	                            }
	                        ]
	                    );
	                    
	                    //页数容器
	                    var _ulPageDom = ss.crtDom('ul','ulPage','',dom,{
	                        cn:['boxSizing','borderRight','float','margin','padding'],
	                        cv:['border-box','none','left','0px','0px']
	                    });
	                    self['domWrap']['_ulPageDom'] = _ulPageDom;
	                    //下一页
	                    ss.crtDom('div','','下一页',dom,{
	                            cn:['border','boxSizing','width','height','lineHeight','float','textAlign','fontSize','color','cursor','borderTopRightRadius','borderBottomRightRadius'],
	                            cv:['1px solid #c6c6c6','border-box','68px','30px','28px','left','center','13px',nextTxtStatus,nextStatus,'3px','3px']
	                        }
	                        ,[
	                            'click',function(dom){
	                                var curPage = self.pageData.page;
	                                if(Number(curPage)==totalPage){
	                                    return;
	                                }
	                                else{
	                                    self.lg_pageRunFn(Number(curPage)+1);
	                                }
	                            }
	                        ]
	                    );
	                    //跳转输入框
	                    ss.crtDom('div','','',dom,{
	                        cn:['border','boxSizing','width','height','lineHeight','float','textAlign','fontSize','color','cursor','marginLeft'],
	                        cv:['1px solid #c6c6c6','border-box','40px','30px','28px','left','center','13px','#333','pointer','10px']
	                    }).appendDom([
	                        ss.crtDom('input','hrefDom','','',{
	                            cn:['display','outline','border','width','height','boxSizing','textAlign'],
	                            cv:['block','none','none','100%','100%','border-box','center']
	                        })
	                    ]);
	                    //跳转
	                    ss.crtDom('div','','跳转',dom,{
	                            cn:['border','boxSizing','width','height','lineHeight','float','textAlign','fontSize','color','cursor','borderRadius','marginLeft'],
	                            cv:['1px solid #c6c6c6','border-box','50px','30px','28px','left','center','13px','#333','pointer','3px','3px']
	                        },
	                        [
	                            'click',function(dom){
	                            var curPage = dom.parentNode.querySelector('input').value;
	                            if(Number(curPage) < 0 || Number(curPage)> Number(self.pageData.totalPage)){
	                                ss.layer.alert("页码输入有误");
	                            }else{
	                                self.lg_pageRunFn(Number(curPage));
	                            }
	                        }
	                        ]
	                    );
	                
                	}
                )
                self.domWrap['productionPage'] = productionPageDom;
                //根据总页数进行
                var ulPageWrap = self['domWrap']['_ulPageDom'];
                if(totalPage<=6){
                    //小页数
                    for(var i=0; i<totalPage; i++){
                        var curDom = ss.crtDom('li','',i+1,ulPageWrap,{
                                cn:['boxSizing','float','border','width','height','lineHeight','listStyle','margin','padding','textAlign','borderRight','fontSize','color','cursor'],
                                cv:['border-box','left','1px solid #c6c6c6','38px','30px','30px','none','0px','0px','center','none','13px','#666','pointer']
                            },
                            [
                                'mouseover',function(dom){
                                    dom.innerHTML!='...' && (
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc',
                                        dom.style.color = '#fff'
                                    );
                                },
                                'mouseout',function(dom){
                                    dom.getAttribute('isClick')!='true' && (
                                        dom.style.backgroundColor = '#fff',
                                        dom.style.color = '#666'
                                    );
                                },
                                'click',function(dom){
                                    self.lg_pageRunFn(Number(dom.innerHTML));
                                }
                            ]
                        );
                        if(i+1==Number(curPage)){
                            curDom.setAttribute('isClick','true');
                            curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                            curDom.style.color = '#fff';
                        }
                    }//for循环
                }
                //大页数
                else{
                    //大页数分两种情况:1.=7时 2.>7时
                    //当前页数1-4的情况
                    if(Number(curPage)>=1 && Number(curPage)<=3){
                        for(var i=0; i<6; i++){
                            var txt = i+1;//标识
                            if(i==4){
                                txt = '...';
                            }
                            if(i==5){
                                txt = totalPage;
                            }
                            var curDom = ss.crtDom('li','',txt,ulPageWrap,{
                                    cn:['boxSizing','float','border','width','height','lineHeight','listStyle','margin','padding','textAlign','borderRight','fontSize','color','cursor'],
                                    cv:['border-box','left','1px solid #c6c6c6',String(txt).length>3 ? (38+8*(String(txt).length-3)+'px'):'38px','30px','30px','none','0px','0px','center','none','13px','#666','pointer']
                                },
                                [
                                    'mouseover',function(dom){
                                    if(dom.innerHTML!='...'){
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                        dom.style.color = '#fff';
                                    }
                                },
                                    'mouseout',function(dom){
                                    if(dom.getAttribute('isClick')!='true'){
                                        dom.style.backgroundColor = '#fff';
                                        dom.style.color = '#666';
                                    }
                                },
                                    'click',function(dom){
                                    if(dom.innerHTML!='...'){
                                        self.lg_pageRunFn(Number(dom.innerHTML));
                                    }
                                }
                                ]);//创建dom
                            //高亮当前页数
                            if((curDom.innerHTML)==Number(curPage)){
                                curDom.setAttribute('isClick','true');
                                curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                curDom.style.color = '#fff';
                            }
                        }//for循环
                    }
                    //当前页数[最大页数-3 - 最大页数]
                    else if( Number(curPage)>=totalPage-3 && Number(curPage)<=totalPage){
                        for(var i=5; i>-1; i--){
                            var txt = totalPage-i;//标识
                            if(i==4){
                                txt = '...';
                            }
                            if(i==5){
                                txt = '1';
                            }
                            var curDom = ss.crtDom('li','',txt,ulPageWrap,{
                                    cn:['boxSizing','float','border','width','height','lineHeight','listStyle','margin','padding','textAlign','borderRight','fontSize','color','cursor'],
                                    cv:['border-box','left','1px solid #c6c6c6',String(txt).length>3?(38+8*(String(txt).length-3)+'px'):'38px','30px','30px','none','0px','0px','center','none','13px','#666','pointer']
                                },
                                [
                                    'mouseover',function(dom){
                                    if(dom.innerHTML!='...'){
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                        dom.style.color = '#fff';
                                    }
                                },
                                    'mouseout',function(dom){
                                    if(dom.getAttribute('isClick')!='true'){
                                        dom.style.backgroundColor = '#fff';
                                        dom.style.color = '#666';
                                    }
                                },
                                    'click',function(dom){
                                    if(dom.innerHTML!='...'){
                                        self.lg_pageRunFn(Number(dom.innerHTML));
                                    }
                                }
                                ]);//创建dom
                            //高亮当前页数
                            if((curDom.innerHTML)==Number(curPage)){
                                curDom.setAttribute('isClick','true');
                                curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                curDom.style.color = '#fff';
                            }
                        }//for循环
                    }
                    //
                    else{
                        for(var i=0; i<6; i++){
                            i==0 && (txt = '1');
                            i==1 && (txt = '...');
                            i==2 && (txt = Number(curPage));
                            i==3 && (txt = Number(curPage)+1);
                            i==4 && (txt = '...');
                            i==5 && (txt = totalPage);
                            var curDom = ss.crtDom('li','',txt,ulPageWrap,{
                                    cn:['boxSizing','float','border','width','height','lineHeight','listStyle','margin','padding','textAlign','borderRight','fontSize','color','cursor'],
                                    cv:['border-box','left','1px solid #c6c6c6',String(txt).length>3?(38+8*(String(txt).length-3)+'px'):'38px','30px','30px','none','0px','0px','center','none','13px','#666','pointer']
                                },
                                [
                                    'mouseover',function(dom){
                                    if(dom.innerHTML!='...'){
                                        dom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                        dom.style.color = '#fff';
                                    }
                                },
                                    'mouseout',function(dom){
                                    if(dom.getAttribute('isClick')!='true'){
                                        dom.style.backgroundColor = '#fff';
                                        dom.style.color = '#666';
                                    }
                                },
                                    'click',function(dom){
                                    if(dom.innerHTML!='...'){
                                        self.lg_pageRunFn(Number(dom.innerHTML));
                                    }
                                }
                                ])//创建dom
                            //高亮当前页数
                            if((curDom.innerHTML)==Number(curPage)){
                                curDom.setAttribute('isClick','true');
                                curDom.style.backgroundColor = obj.lightingColor || '#3089dc';
                                curDom.style.color = '#fff';
                            }
                        }//for循环
                    }
                }
            }
        },
        //表格->分页->信息展示
        rd_pageFn_info:function(self){
            var self = self,obj = self.sourceObj,pageDom =self.domWrap['dtpWrap'];
            self.domWrap['allCountDom'] && self.domWrap['allCountDom'].parentNode.removeChild(self.domWrap['allCountDom']);
        	if(pageDom){
	            //共有条数展示
	            var allCountDom = ss.crtDom('div','allCount','',pageDom,{
	            	cn:['position','left','top'],
	            	cv:['absolute','0px','15px']
	            })
	            .appendDom(function(dom){
	            	ss.crtDom('div','','',dom,{
		                cn:[
		                	'height','lineHeight','padding','border','borderRadius','display','verticalAlign'
	                	],
		                cv:[
		                	'30px','30px','0px 10px','1px solid #ccc','3px','inline-block','top'
		                ]
	            	})
	            	.appendDom(function(dom){
						ss.crtDom('span','','共有：',dom,{
		                    cn:['color','fontSize'],
		                    cv:['#333','14px']
		                }),
		                ss.crtDom('span','',self['tableData']['totalRecords']||'0',dom,{
		                    cn:['color','fontSize'],
		                    cv:['#3089dc','14px']
		                }),
		                ss.crtDom('span','',' 条',dom,{
		                    cn:['color','fontSize'],
		                    cv:['#333','14px']
		                })      
	            	});
            	});
	            self.domWrap['allCountDom'] = allCountDom;
        	};//存在分页
        	//存在勾选框->开启勾选项的信息显示
            if(obj['table']['options']['isCheckbox']){
				ss.crtDom('div', '', '', self['domWrap']['allCountDom'], {
					cn: [
						'height', 'lineHeight', 'padding', 'border', 'borderRadius', 'display', 'verticalAlign', 'marginLeft'
					],
					cv: [
						'30px', '30px', '0px 10px', '1px solid #ccc', '3px', 'inline-block', 'top', '10px'
					]
				})
				.appendDom(function(dom) {
					ss.crtDom('span', '', '选中：', dom, {
						cn: ['color', 'fontSize'],
						cv: ['#333', '14px']
					});
					var checkDom = ss.crtDom('span', '', '0', dom, {
						cn: ['color', 'fontSize'],
						cv: ['#3089dc', '14px']
					});
					ss.crtDom('span', '', ' 条', dom, {
						cn: ['color', 'fontSize'],
						cv: ['#333', '14px']
					});
					self['domWrap']['checkDom'] = checkDom;
				});
            	
            };

			
        },//
        
    };
    out('dtPage',dtPage);
})