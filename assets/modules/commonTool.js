/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(['ajax'],function(out){
	//公共方法
	var commonTool = {
		//轮询器
		poll:function(){
            (function(s){
                var selDataObj = urlData[s];
                self.eAjax(
                    fqObj,
                    {
                        success:function(data){
                            var selDatas = data['data'];
                            selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data,'data',selDataObj['digitalModel']));
                            var newWrap = [];//[name:'',code:'']形式
                            var isName = selDataObj['rely'] && selDataObj['rely']['name'];
                            var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
                            for(var v=0; v<selDatas.length; v++){
                                newWrap.push({
                                    name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
                                    code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
                                });
                            };
                            //转换成->shim别名形式
                            var shimWrap = {};
                            newWrap.forEach(function(v){
                                shimWrap[v['code']] = v['name'];
                            });
                            self.scope['shimScope'][s] = shimWrap;
                        },
                        isJson:isJsonTF
                    }
                );
            })(s)
	        //轮询数据
	        var timer2 = window.setInterval(function(){
	            var isTf = true;
	            for(var e in self.scope['shimScope']){
	                self.scope['shimScope'][e] || (isTf = false);
	            };
	            isTf && (window.clearInterval(timer2),crtFn());
	        },10);
		},//轮询器
		//取消下拉框
		lg_bodyCliFn:function(cliFn){
	        if(ss.bodyClickObj.listeners[location.hash.slice(1)]) {
	            var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
	            tempArr.push(function() {
	                cliFn();
	            });
	            ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
	        } else {
	            var tempArr = [];
	            tempArr.push(function() {
	                cliFn();
	            });
	            ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
	        };
		},
		//渲染函数
		renderFn:function(name, data, appendDom, txt, type, defaultCode,cssObj){
			var commonThis = this;
			var leftW = 100;
	        //选择评定标准
	        var selItem = ss.crtDom('div', 'items', '', appendDom, {
	            cn: [
	            	'width', 'height', 'padding-top','position',
	            	'paddingLeft','lineHeight'
	            ],
	            cv: [
	            		'100%', cssObj&&cssObj['height']?cssObj['height']:'50px', '0px','relative',
	            		cssObj&&cssObj['paddingLeft']?cssObj['paddingLeft']:leftW+'px',cssObj&&cssObj['height']?cssObj['height']:'50px'
	            	],
	        })
            .appendDom([
	                //左---
	                ss.crtDom('div', 'wrapLeft', name + '：', '', {
	                    cn: [
	                    	'width', 'height', 'textAlign', 'fontSize', 'marginBottom',
	                    	'position','top','left'
                    	],
	                    cv: [
	                    	cssObj&&cssObj['paddingLeft']?cssObj['paddingLeft']:leftW+'px', '100%', 'left', '14px', '10px',
	                    	'absolute','0px','0px'
	                    ]
	                }),
	                //右---
	                ss.crtDom('div', 'wrapRight', '', '', {
	                    cn: ['width', 'height'],
	                    cv: ['100%', '100%'],
	                    an: ['name', 'code'],
	                    av: [txt, defaultCode ? getCodeName(defaultCode, data) : '']
	                })
	                .appendDom(function(dom) {
	                    //下拉框类型
	                    if(type == 'select') {
	                        ss.crtDom('div', 'selDom', defaultCode ? getCodeName(defaultCode, data) : '请选择', dom, {
	                            cn: [
	                                'width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize',
	                                'borderRadius', 'userSelect', 'cursor', 'position', 'display'
	                            ],
	                            cv: [
	                                '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', defaultCode ? '#000' : '#757575', '13px',
	                                '3px', 'none', 'pointer', 'relative', 'inline-block'
	                            ]
	                        }, [
	                            'click',
	                            function(dom, e) {
	                                //下拉框展开
	                                ss.getDom('.selectItems', dom).style.display = 'block';
	                                ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
	                                ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
	                                e.stopPropagation();
	                                commonThis.lg_bodyCliFn(clearSW);
	                            }
	                        ])
	                            .appendDom(function(dom) {
	                                var fDom = dom;
	                                //select->icon
	                                ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), dom, {
	                                    cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
	                                    cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
	                                });
	                                //select->con
	                                ss.crtDom('div', 'selectItems', '', dom, {
	                                    cn: [
	                                        'width', 'height',
	                                        'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'
	                                    ],
	                                    cv: [
	                                        '100%', data.length < 5 ? 'auto' : 5 * 30 + 'px',
	                                        '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13
	                                    ],
	                                })
	                                    .appendDom(function(dom) {
	                                        var crtDom = function(dataArr, type) {
	                                            //遍历渲染fn
	                                            dataArr.forEach(function(v, i) {
	                                                ss.crtDom('p', '', v.name, dom, {
	                                                    cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
	                                                    cv: ['0px 10px', '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
	                                                    an: ['code','type'],
	                                                    av: [v.code,txt]
	                                                }, [
	                                                    'mouseenter',
	                                                    function(dom) {
	                                                        ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff'])
	                                                    },
	                                                    'mouseleave',
	                                                    function(dom) {
	                                                        ss.mdfCss(dom, ['backgroundColor', '#fff', 'color', '#333'])
	                                                    },
	                                                    'click',
	                                                    function(dom, e) {
	                                                        clearSW(); //清除状态
	                                                        var saveValDom = dom.parentNode.parentNode.parentNode;
	                                                        var txtDom = ss.getDom('.selDom', saveValDom);
	                                                        ss.mdfCss(txtDom, ['color', '#000']);
	                                                        ss.mdfAttr(saveValDom, ['code', dom.getAttribute('code')]);
	                                                        ss.setDomTxt(txtDom, dom.innerHTML);
	                                                        e.stopPropagation();
	                                                    }
	                                                ])
	                                            });
	                                        };
	                                        crtDom(data, 'fixed');
	                                    })
	                            });
	                    };
	                    //输入框类型->文本类型
	                    if(type == 'txt') {
	                        ss.crtDom('input', '', '', dom, {
	                            cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'boxSizing', 'paddingLeft'],
	                            cv: ['80%', '30px', '1px solid #ccc', '14px', '6px', 'border-box', '10px'],
	                            an: ['placeholder', 'type', 'name','value'],
	                            av: ['请输入' + name, 'text', txt,data]
	                        }, [
	                            'change',
	                            function(dom) {
	                                //self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
	                            }
	                        ]);
	                    };
                        //time类型
                        if(type === 'time'){
                            var timeDom = ss.crtDom('input','','',dom,{
                                cn:['width','height','borderBottom','fontSize','marginTop'],
                                cv:['100%','30px','1px solid #ccc','14px','6px'],
                                an:['placeholder','name'],
                                av:['请选择'+name,txt]
                            });
                            !ss.laydate && ss.error('未引入时间控件！')
                            ss.laydate.render({
                                elem: timeDom,
                                type:data||'date',
                                value:'',
                                done:function(val){
                                    //self['scope']['addParaObj'][timeDom.getAttribute('name')] = val;
                                }
                            })
                        };
	                    //输入框类型->数字类型
	                    if(type == 'num') {
	                        ss.crtDom('input', '', '', dom, {
	                            cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'boxSizing', 'paddingLeft'],
	                            cv: ['80%', '30px', '1px solid #ccc', '14px', '6px', 'border-box', '10px'],
	                            an: ['placeholder', 'type', 'name'],
	                            av: ['请输入' + name, 'number', txt]
	                        }, [
	                            'change',
	                            function(dom) {
	                                //self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
	                            }
	                        ]);
	                    };
	                    //输入框类型->模糊下拉框
	                   	if(type=='blurrySel'){
		                    ss.crtDom('div','blurrySelWrap','',dom,{
			                        cn:['paddingTop','display','height','verticalAlign','position','width'],
			                        cv:['7px','inline-block','40px','top','relative','80%'],
			                        an:['name','showName'],
			                        av:[txt,name]
		                    })
		                    .appendDom(function(dom){
	                            var blurrySelDom = ss.crtDom('div',txt,'',dom,{
	                                cn:['height','lineHeight','border','backgroundColor','color','width','fontSize','borderRadius','verticalAlign','marginTop'],
	                                cv:['30px','30px','1px solid #dee4f1','#f4f8fa','#757575','100%','13px','2px','top','0px'],
	                                an:['txt'],
	                                av:[txt]
	                            });
	                            //实例带首字母模糊搜索的下拉框
	                            function dtVagueSleFn(renderData){
	                            	var dtSelf = self;
	                            	function getName2(code){
	                            		for(var t=0; t<renderData.length; t++){
	                            			if(renderData[t].code == code){
	                            				return renderData[t].name;
	                            			};
	                            		};
	                            	};
	                                var dtVagueSleSelf = new ss.dtVagueSle({
	                                	name:dom.getAttribute('showName'),//选项名
	                                    appendTo:blurrySelDom,//追加元素
	                                    data:renderData,//依赖数据
	                                    hv:30,
	                                    //默认值
	                                    cbFn:function(self){

	                                    },//点击回调
	                                    clearFn:function(self){

	                                    },//清空回调
	                                });
                                    var curDom = dom;
                                    //下拉框隐藏
                                    var clearStatuFn = function(){
                	                    var wrapDom = ss.getDomAll('.vg_wrap',dom);
					                    var svgDom = ss.getDomAll('.vg_svg',dom);
					                    if(wrapDom){
					                        for(var d=0; d<wrapDom.length; d++){
					                        	wrapDom[d].style.display = 'none';
					                        	svgDom[d].children[0].style.transform = 'rotate(0deg)';
					                        }
					                    };
                	                    //清空所有的输入框内容
										dtVagueSleSelf.lg_inputFn('',dtVagueSleSelf);
                                    };
                                    if(ss.bodyClickObj.listeners[location.hash.slice(1)]){
                                        var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
                                        tempArr.push(function(){
                                            clearStatuFn();
                                        });
                                        ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                    }
                                    else{
                                        var tempArr = [];
                                        tempArr.push(function(){
                                            clearStatuFn();
                                        });
                                        ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
                                    };
	                            };
                                //固定
                                dtVagueSleFn(data);

		                    });
	                        
	                   	}
	                     
	                })
	            ]);
	       
	       //评定下拉框清除状态
	        function clearSW() {
	            ss.getDom('.selectItems', selItem).style.display = 'none';
	            ss.getDom('.dateSvg', selItem).style.transform = 'rotate(0deg)';
	            ss.mdfCss(ss.getDom('.selDom', selItem), ['boxShadow', 'none', 'border', '1px solid #dee4f1']);
	        };
	        return selItem;
		}
	};//commonTool
	
    out('commonTool',commonTool);
})
