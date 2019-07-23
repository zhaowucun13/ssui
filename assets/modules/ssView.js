/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out) {
	
	function ssView(){
		this.scope = {};
		this.domWrap = {};
		this.init();//初始化
	}
	ssView.prototype = {
		construct:ssView,
		init:function(){

		},
		//弹窗渲染
		render:function(obj){
			var self = this;
			var viewContainer = document.createDocumentFragment(); 
			//遮罩层
			var shadeView = ss.crtDom('div', 'ss_view_shade', '', viewContainer, {
				cn: ['width', 'height', 'position', 'top', 'left', 'backgroundColor', 'opacity', 'zIndex'],
				cv: [ss.paraWrap.clwx, ss.paraWrap.clhx, 'fixed', '0px', '0px', '#000', .3, 1300]
			});
			var defaultW = obj.width || 0.5;
			//内容
			var conView = ss.crtDom('div', 'ss_view_con', '', viewContainer, {
					cn: [
						'width', 'position', 'top', 
						'left', 'backgroundColor', 'borderRadius', 'zIndex', 'padding',
						'opacity','transform','transition'
					],
					cv: [ 
						ss.paraWrap.clw * defaultW + 'px', 'fixed', ( obj.dpCss && obj.dpCss.top )|| ss.paraWrap.clh * .1 + 'px', 
						ss.paraWrap.clw * (1-defaultW)/2 + 'px', '#fff', '5px', 1301, '0% 3%',
						0,'scale(.7)','all .4s' 
					]
				})
				.appendDom(function(dom) {
					//内容标题
					ss.crtDom('div', 'ss_viewC_tit', obj.title||'提示窗', dom, {
						cn: ['cursor', 'widht', 'height', 'fontSize', 'color', 'borderBottom', 'position', 'lineHeight', 'textAlign', 'color'],
						cv: ['move', '100%', '48px', '17px', '1f1f1f', '1px solid #e5e5e5', 'relative', '48px', 'center', '#333'],
					}); 
					//内容容器
					ss.crtDom('div', 'ss_viewC_con', '', dom, {
						cn: ['width', 'boxSizing', 'padding', 'clear', 'transition'],
						cv: ['100%', 'border-box', '10px 0px', 'both', 'all .3s'],
					});
					//内容按钮容器
					ss.crtDom('div', 'ss_viewC_btn', '', dom, {
							cn: ['width', 'height', 'fontSize', 'boxSizing', 'bottom', 'borderTop', 'left', 'lineHeight', 'textAlign'],
							cv: ['100%', '54px', '18px', 'border-box', '0px', '1px solid #e5e5e5', '0%', '54px', 'center'],
						})
						.appendDom(function(dom) {
							//保存按钮
							ss.crtDom('span', 'ss_viewC_btnSave', obj.btnName || '保存', dom, {
								cn: ['color', 'backgroundColor', 'fontSize', 'padding', 'borderRadius', 'marginRight', 'cursor'],
								cv: ['#fff', '#3089DC', '13px', '3px 14px', '2px', '15px', 'pointer']
							}, [
								'click',
								function(dom) {
									var _itemObj = obj.item;
									var _addParaObj = self.scope.addParaObj;
									
									//校验参数
									var addParaVerObj = self['scope']['addParaVerObj'];
									for(var x in addParaVerObj) {
										if(!_addParaObj[x] && _addParaObj[x]!==0) { 
											layer.msg(addParaVerObj[x] + '未填写！');
											return;
										}
									};
									//针对单字段的校验 ->通过check 
									var _curItems = obj.item;
									for(var k in _addParaObj) {
										var checkObj = _curItems[k].check;
										if(checkObj && checkObj(_addParaObj,self).result) {
											layer.msg(checkObj(_addParaObj,self).tip); 
											return;
										}
									};
									var returnVal = obj.sureCliFn && obj.sureCliFn(self);
									returnVal!='return' && self.hidden();
								}
							]);
							//取消按钮
							ss.crtDom('span', 'ss_viewC_btnCan', '取消', dom, {
								cn: ['color', 'backgroundColor', 'fontSize', 'padding', 'borderRadius', 'marginLeft', 'cursor'],
								cv: ['#fff', '#3089DC', '13px', '3px 14px', '2px', '15px', 'pointer']
							}, [
								'click',
								function(dom) {
									self.hidden();
								}
							])
						})

				});
			self.domWrap['shadeView'] = shadeView;
			self.domWrap['conView'] = conView;
			self.domWrap['viewC_tit'] = ss.getDom('.ss_viewC_tit', conView);
			self.domWrap['viewC_con'] = ss.getDom('.ss_viewC_con', conView);
			self.domWrap['viewC_btnSave'] = ss.getDom('.ss_viewC_btnSave', conView);
			ss.getDom('body').appendChild(viewContainer);
		},
		//弹窗内容 -> 选项渲染
		itemRender:function(item,obj){
			var self = this;
			//虚拟dom
			var nviewContainer = document.createDocumentFragment();
			//新增参数存储
			self['scope']['addParaObj'] = {};
			//需要校验的参数存储
			self['scope']['addParaVerObj'] = {};
			var addViewData = item;
			//判断是否为form
			var _isForm = obj.type && obj.type=='form';
			if(_isForm){
				var _formDom = ss.crtDom('form','','',nviewContainer,{
					an:['enctype'],
					av:[obj.enctype || 'multipart/form-data']
				});
				self.domWrap['_formDom'] = _formDom;
			};
			//判断是否要默认赋值
			var _isTF = obj.defaultData ? true : false;
			var _curData = obj.defaultData;//默认值
			//渲染
			for(var x in addViewData) {
				self['scope']['addParaObj'][x] = ''; //各个字段为空
				addViewData[x].verify && (self['scope']['addParaVerObj'][x] = addViewData[x].name);
				var itemH = '45px'; //每项高度
				//选项容器
				var itemDom = ss.crtDom('div', 'items', '', obj.type && obj.type=='form' ? _formDom :nviewContainer, {
						cn: ['position', 'width', 'height', 'lineHeight', addViewData[x].type === 'pic' && 'marginTop'],
						cv: [
							'relative', '100%',
							(addViewData[x].type === 'numbers' || addViewData[x].type === 'mulSelect' || addViewData[x].type === 'pic' || addViewData[x].type === 'video') ?
							'auto' :
							itemH, itemH, '10px'
						],
						an: ['name'],
						av: [x]
					})
					.appendDom(
						function(dom) {
							//左---
							var leftVal = addViewData[x].isPer ?
								addViewData[x].name + '(%)' + '：' :
								(addViewData[x].verify ? (addViewData[x].name + '：') : (addViewData[x].name + '：'));
							//左--- 
							ss.crtDom('div', '', addViewData[x].verify ? '*'+addViewData[x].name + '：' : addViewData[x].name + '：', dom, {
									cn: [
										'display', 'verticalAlign', 'width', 
										'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize' 
									],
									cv: [
										'inline-block', 'top', (addViewData[x].dpCss && addViewData[x].dpCss.left) || '40%', 
										'100%', 'right', '10px', '10px', '14px'
									]
								}),
								//中---
								ss.crtDom('div', '', '', dom, {
									cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
									cv: ['inline-block', 'top', '44%', '100%', addViewData[x].type === 'mulSelect' ? '50px' : '0']
								})
								.appendDom(function(dom) {
									//txt类型
									if(addViewData[x].type === 'txt') {
										var _txtInput = ss.crtDom('input', '', '', dom, {
											cn: [
													'width', 'height', 'border', 'fontSize', 'marginTop', 'padding', 'border-radius',
													'display'
											],
											cv: [
													'100%', '30px', '1px solid #ccc', '14px', '6px', '3px 5px', '4px',
													addViewData[x].isShow=='false'?'none':'block' 
											],
											an: [
													'placeholder', 
													'type', 'name',
													'value'
											],
											av: [
													addViewData[x].placeholder || '请输入' + addViewData[x].name,
													'text', x,
													_isTF ? ((_curData[addViewData[x].shim||x] || _curData[addViewData[x].shim||x]===0)? _curData[addViewData[x].shim||x] : '' ): '' 
											]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
											}
										]);
										//隐藏域 
										addViewData[x].isShow=='false' && (dom.parentNode.style.display = 'none');
										
										_isTF && (self['scope']['addParaObj'][x]=(_curData[addViewData[x].shim||x] || _curData[addViewData[x].shim||x]===0)? _curData[addViewData[x].shim||x] : '');
										addViewData[x].readonly && (
											_txtInput.setAttribute('readonly','readonly'),
											ss.mdfCss(_txtInput,['backgroundColor','#eee'])
										);
									};
									//excel类型
									if(addViewData[x].type === 'excel'){
										//当前时间戳
										var _curTime = String(new Date().getTime()).slice(5);
										var _labelDom = ss.crtDom('label', '', addViewData[x].placeHolder || '选择', dom, {
											cn: [
												'width', 'height', 'border', 'fontSize', 'verticalAlign', 'padding', 'border-radius',
												'textOverflow','overflow','whiteSpace','display','lineHeight','cursor'
											],
											cv: [
												'200px', '30px', '1px solid #ccc', '14px', 'middle', '0px 6px', '4px',
												'ellipsis','hidden','nowrap' ,'inline-block','30px','pointer'
											], 
											an: ['for'],
											av: ['ss_label'+_curTime]
										});
										ss.crtDom('input', '', '', dom, {
											cn:['display'],cv:['none'],
											an:['type','name','id'],av:['file',x,'ss_label'+_curTime]
										},[
											'change',function(dom,e){
												var file = dom.files[0]; 
												//判断所选择文件是否为excel文件类型
												if(/\.xlsx|\.xlsm|\.xls|\.csv/.test(file.name)) {
													_labelDom.innerHTML = file.name;
													self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
												} else {
													layer.msg('非excel文件，请重新选择');
													return;
												}
											}
										]);
										//存在下载模板->则创建
										if(addViewData[x].load){ 
											ss.crtDom(
												'span', 
												'',  
												addViewData[x].load.name || '选择', dom, {
												cn:['cursor','marginLeft','color','textDecoration'],
												cv:['pointer','20px','rgb(48, 137, 220)','underline'] 
											},[
												'click',function(){
													window.location.href = addViewData[x].load.url;
												}
											])
										}
									};
									//area类型
									if(addViewData[x].type === 'area') {
										_isTF && (self['scope']['addParaObj'][x]=(_curData[x] || _curData[x]===0)? _curData[x] : '');
										var _textareaDom = ss.crtDom('textarea', 'add', _isTF ? ((_curData[x] || _curData[x]===0)? _curData[x] : '' ): '' , dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding'], 
											cv: ['100%', '60px', '1px solid #ccc', '14px', '6px', '0px'],
											an: ['placeholder', 'name'], 
											av: ['请输入' + addViewData[x].name, x]
										}, [
											'change',
											function(dom) {
												var curVal = dom.value;
												if(/([^\u4e00-\u9fa5|\w])/.test(curVal) && addViewData[x].wrap) {
													var nCode = /([^\u4e00-\u9fa5|\w])/g.exec(curVal)[0];
													var tempArr = curVal.split(nCode);
													var endStr = '';
													for(var b = 0; b < tempArr.length; b++) {
														endStr = endStr + '<p>' + tempArr[b] + '</p>'
													}
													self['scope']['addParaObj'][dom.getAttribute('name')] = endStr;
												} else {
													self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
												};
											}
										])
										_isTF && (_textareaDom.innerHTML = _curData[x]);
										addViewData[x].readonly && (
											_textareaDom.setAttribute('readonly','readonly'),
											ss.mdfCss(_textareaDom,['backgroundColor','#eee'])
										);
										addViewData[x].underTxt && (
											ss.crtDom('p', '', addViewData[x].underTxt, dom, {
												cn:['color','lineHeight','margin','height'],
												cv:['red','1px','0px','20px']
											})  
										)
									};
									//num类型
									if(addViewData[x].type === 'num') {
										var _numInput = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding', 'border-radius'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px', '3px 5px', '4px'],
											an: [
													'placeholder', 
													'type', 'name',
													'value'
											],
											av: [
													addViewData[x].placeholder || '请输入' + addViewData[x].name,
													'text', x,
													_isTF ? ((_curData[x] || _curData[x]===0)? _curData[x] : '' ): '' 
											]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
											}
										]);
										_isTF && (self['scope']['addParaObj'][x]=(_curData[x] || _curData[x]===0)? _curData[x] : '');
										addViewData[x].readonly && (
											_numInput.setAttribute('readonly','readonly'),
											ss.mdfCss(_numInput,['backgroundColor','#eee'])
										);
									};
									//numbers类型
									if(addViewData[x].type === 'numbers') {
										ss.crtDom('textarea', '', '', dom, {
											cn: ['width', 'border', 'fontSize', 'marginTop', 'padding', 'border-radius'],
											cv: ['100%', '1px solid #ccc', '14px', '6px', '3px 5px', '4px'],
											an: ['rows', 'cols', 'placeholder', 'type', 'name'],
											av: ['5', '40', '请输入' + addViewData[x].name, 'text', x]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
											},
											'input',
											function(dom) {
												$(dom).val($(dom).val().replace(/[^\(0-9)\,]/g, ''));
											}
										]);
									};
									//number类型
									if(addViewData[x].type === 'number') {
										ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding', 'border-radius'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px', '3px 5px', '4px'],
											an: ['maxlength', 'placeholder', 'type', 'name', 'onkeyup'],
											av: ['11', '请输入' + addViewData[x].name, 'text', x, "this.value=this.value.replace(/[^\(0-9)]/g,'')"]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
											},
											'input',
											function(dom) {
												$(dom).val($(dom).val().replace(/[^\(0-9)]/g, ''));
											}
										]);
									};
									//IP类型
									if(addViewData[x].type === 'IP') {
										ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding', 'border-radius'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px', '3px 5px', '4px'],
											an: ['placeholder', 'type', 'name','domName'],
											av: ['请输入' + addViewData[x].name, 'text', x,addViewData[x].name]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
											},
											'blur',
											function(dom) {
												var strRegex = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/
												if(!strRegex.test(dom.value)) {
													layer.msg('请输入正确的'+dom.getAttribute('domName'))
													dom.value = "";
													return false;
												}
											}
										]);
									};
									//time类型
									if(addViewData[x].type === 'time') {
										var timeDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding', 'border-radius'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px', '3px 5px', '4px'],
											an: ['autocomplete', 'placeholder', 'name'],
											av: ['off', '请选择' + addViewData[x].name, x]
										});
										!ss.laydate && ss.error('未引入时间控件！')
										ss.laydate.render({
											elem: timeDom,
											type: addViewData[x].timeType || 'date',
											value: '',
											done: function(val) {
												self['scope']['addParaObj'][timeDom.getAttribute('name')] = val;
											}
										})
									};
									//select类型
									if(addViewData[x].type === 'select') {
										_isTF && (self['scope']['addParaObj'][x]=(_curData[x] || _curData[x]===0)? _curData[x] : '');
										ss.crtDom('div', '', addViewData[x].name, dom, {
												cn: ['width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize', 'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'],
												cv: [addViewData[x].width ? addViewData[x].width : '100%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#fff', '#757575', '13px', '3px', 'none', 'pointer', 'relative', '5px'],
												an: ['name', 'code'],
												av: [x, '']
											}, [
												'click',
												function(dom, e) {
													//下拉框展开
													ss.getDom('.selectItems', dom).style.display = 'block';
													ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
													ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
													//展开高亮
													var pDoms = ss.getDom('.selectItems', dom).children;
													for(var c = 0; c < pDoms.length; c++) {
														ss.mdfCss(pDoms[c], ['backgroundColor', '#fff', 'color', pDoms[c].getAttribute('code') ? '#333' : '#ccc']);
													}
													if(dom.getAttribute('code')) {
														for(var b = 0; b < pDoms.length; b++) {
															pDoms[b].getAttribute('code') && pDoms[b].getAttribute('code') === dom.getAttribute('code') &&
																ss.mdfCss(pDoms[b], ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff']);
														}
													};
													var curDom = dom;
													//下拉框隐藏
													var clearStatuFn = function() {
														var dom = ss.getDom('.selectItems', curDom);
														ss.getDom('.selectItems', curDom).style.display = 'none';
														ss.getDom('.dateSvg', dom.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
														ss.mdfCss(dom.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.parentNode.getAttribute('code') ? '#000' : '#757575']); //
													};
													if(ss.bodyClickObj.listeners[location.hash.slice(1)]) {
														var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
														tempArr.push(function() {
															clearStatuFn();
														});
														ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
													} else {
														var tempArr = [];
														tempArr.push(function() {
															clearStatuFn();
														});
														ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
													};

													e.stopPropagation();
												}
											])
											.appendDom(function(dom){
												var fDom = dom;
												//select->icon
												ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), dom, {
													cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
													cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
												}),
												//select->con
												ss.crtDom('div', 'selectItems', '', dom, {
													cn: ['width', 'height', 'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'],
													cv: [addViewData[x].width ? addViewData[x].width : '100%', addViewData[x].data.length < 5 ? 'auto' : addViewData[x].data.length * 30 + 'px', '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13],
													an: ['txt'],
													av: [x]
												})
												.appendDom(function(dom) {
													if(addViewData[x].data) {
														//若是form表单，则创建一个隐藏域来存储
														_isForm && ss.crtDom('input', '', '', dom, {
															an:['type','name', 'value'],
															av:['hidden',x , _isTF ? _curData[x] : '']
														});
														
														//[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
														var crtDom = function(dataArr, sData) {
															//存在默认值则赋值
															if(_isTF){
																function endNameCodeFn(dataArr, curVal) {
																	var tempObj = {};
																	for(var e = 0; e < dataArr.length; e++) {
																		(dataArr[e].code == curVal || dataArr[e].name == curVal) &&
																		(tempObj['eName'] = dataArr[e].name, tempObj['eCode'] = dataArr[e].code);
																	}
																	return tempObj;
																};
																var xx = dom.getAttribute('txt'); //当前修改的字段
																//追加编辑的默认值
																var endD = endNameCodeFn(dataArr, _curData[xx]);
																ss.setDomTxt(fDom, endD.eName);
																ss.mdfAttr(fDom, ['code', endD.eCode]); 
															}
					
															dataArr.forEach(function(v, i) {
																ss.crtDom('p', '', v.name, dom, {
																	cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace','margin'],
																	cv: ['0px 10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap','0px'],
																	an: ['code'],
																	av: [v.code]
																}, [
																	'mouseenter',
																	function(dom) {
																		ss.mdfCss(dom, ['backgroundColor', 'rgb(41, 103, 153)', 'color', '#fff'])
																	},
																	'mouseleave',
																	function(dom) {
																		var isTF = dom.getAttribute('code') && dom.parentNode.parentNode.getAttribute('code') === dom.getAttribute('code'); //满足选中状态
																		ss.mdfCss(dom, ['backgroundColor', isTF ? 'rgb(41, 103, 153)' : '#fff', 'color', isTF ? '#fff' : (dom.getAttribute('code') ? '#333' : '#ccc')]);
																	},
																	'click',
																	function(dom, e) {
																		ss.setDomTxt(dom.parentNode.parentNode, dom.innerHTML); //赋值
																		dom.parentNode.parentNode.setAttribute('code', dom.getAttribute('code')); //code属性赋值
																		//存在隐藏域->则赋值
																		var _hiddenInput = dom.parentNode.querySelector('[name="'+dom.parentNode.parentNode.getAttribute('name')+'"]');
																		_hiddenInput && (_hiddenInput.value = dom.getAttribute('code'));
																		
																		self['scope']['addParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
																		dom.parentNode.style.display = 'none'; //下拉框隐藏
																		ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
																		ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //
																		//点击回调
																		var indexVal = dom.parentNode.parentNode.parentNode.parentNode.getAttribute('name');
																		addViewData[indexVal].cbFn && addViewData[indexVal].cbFn(dom, sData[i]);
																		e.stopPropagation();
																	}
																])
															})
														};

														//是否数组，对象则需要动态获取
														ss.judgeArr(addViewData[x].data) ?
															(
																addViewData[x].beforeArr?
																crtDom([{name: '' + addViewData[x].name + '',code: ''}].concat(addViewData[x].beforeArr).concat(addViewData[x].data))
																	:
																crtDom([{name: '' + addViewData[x].name + '',code: ''}].concat(addViewData[x].data))
															) 
																:
															(function(x) {
																var isJsonTF = addViewData[x].data.dataType && addViewData[x].data.dataType === 'json';
																var fqObj = {
																	url: addViewData[x].data.url,
																	type: addViewData[x].data.type || 'post'
																};
																//data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
																isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
																addViewData[x].data.data &&
																	(fqObj['data'] = isJsonTF ? JSON.stringify(addViewData[x].data.data) : addViewData[x].data.data); //json方式传输赋值

																var selDataObj = addViewData[x].data;
																//获得数据
																self.ajax(
																	fqObj,
																	function(data) {
																		var selDatas = data['data'];
																		selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']));
																		var newWrap = [];
																		var isName = selDataObj['rely'] && selDataObj['rely']['name'];
																		var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
																		for(var v = 0; v < selDatas.length; v++) {
																			newWrap.push({
																				name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
																				code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
																			});
																		};
																		crtDom(
																			addViewData[x].beforeArr?
																			[{ name: '' + addViewData[x].name + '', code: '' }].concat(addViewData[x].beforeArr.concat(newWrap))
																				:
																			[{ name: '' + addViewData[x].name + '', code: '' }].concat(newWrap),
																			selDatas
																		);
																	},
																	//complete
																	function() {

																	},
																	//beforeSend
																	function(request) {
																		isJsonTF &&
																			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
																	}
																);
															}(x));
													} else {
														ss.error('下拉框选项数据未找到！');
														return;
													}
												})
											
											});
									};
									//blurrySel类型 -> 带模糊搜索的下拉框
									if(addViewData[x].type === 'blurrySel') {
										_isTF && (self['scope']['addParaObj'][x]=(_curData[x] || _curData[x]===0)? _curData[x] : '');
										ss.crtDom('div', x + 'Wrap', '', dom, {
												cn: ['paddingTop', 'display', 'height', 'verticalAlign', 'position', 'marginRight'],
												cv: ['7px', 'inline-block', '40px', 'top', 'relative', addViewData[x].isLine ? '3px' : '8px'],
												an: ['name', 'showName'],
												av: [x || '', addViewData[x].name || '']
											})
											.appendDom(function(dom) {
												var blurrySelDom = ss.crtDom('div', addViewData[x].txt, '', dom, {
													cn: ['height', 'lineHeight', 'border', 'backgroundColor', 'color', 'width', 'fontSize', 'borderRadius', 'verticalAlign', 'marginTop'],
													cv: ['30px', '30px', '1px solid #dee4f1', '#f4f8fa', '#757575', addViewData[x].width ? addViewData[x].width : addViewData[x].name.length * (addViewData[x].type === 'date' ? 32 : 28) + 'px', '13px', '2px', 'top', '0px'],
													an: ['txt'],
													av: [x]
												});
												//若是form表单，则创建一个隐藏域来存储
												_isForm && ss.crtDom('input', '_blurrySel_input', '', dom, {
													an:['type','name','value'],
													av:['hidden',x, _isTF?_curData[x]:'']
												});
												//实例带首字母模糊搜索的下拉框
												function dtVagueSleFn(renderData) {
													var dtSelf = self;
													
													function getName2(code) {
														for(var t = 0; t < renderData.length; t++) {
															if(renderData[t].code == code) {
																return renderData[t].name;
															};
														};
													};
													var _configObj = {
														name: dom.getAttribute('showName'), //选项名
														appendTo: blurrySelDom, //追加元素
														data: renderData, //依赖数据
														hv: 30, 
														cbFn: function(self) {
															dtSelf['scope']['addParaObj'][dom.getAttribute('name')] = self['scope']['code'];
															//存在隐藏域的值->则赋值(配合form表单)
															var _hiddenInput = self.domWrap.show.parentNode.parentNode.parentNode.querySelector('._blurrySel_input');
															_hiddenInput && (_hiddenInput.value = self['scope']['code']);
														}, //点击回调 
														clearFn: function(self) {
															//document.querySelector('#userId').setAttribute('value','');
														}, //清空回调
													};
													//默认值追加 
													_isTF && (
														_configObj['defaultVal'] = obj.defaultData[dom.getAttribute('name')],
														_configObj['defaultName'] = getName2(obj.defaultData[dom.getAttribute('name')])
													);
									
													var dtVagueSleSelf = new ss.dtVagueSle(_configObj); 
													var curDom = dom;
													//下拉框隐藏
													var clearStatuFn = function() {
														var wrapDom = ss.getDomAll('.vg_wrap', dom);
														var svgDom = ss.getDomAll('.vg_svg', dom);
														if(wrapDom) {
															for(var d = 0; d < wrapDom.length; d++) {
																wrapDom[d].style.display = 'none';
																svgDom[d].children[0].style.transform = 'rotate(0deg)';
															}
														};
														//清空所有的输入框内容
														dtVagueSleSelf.lg_inputFn('', dtVagueSleSelf);
													};
													if(ss.bodyClickObj.listeners[location.hash.slice(1)]) {
														var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
														tempArr.push(function() {
															clearStatuFn();
														});
														ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
													} else {
														var tempArr = [];
														tempArr.push(function() {
															clearStatuFn();
														});
														ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
													};
												};
												//判断数据是固定还是动态加载
												if(addViewData[x].data && ss.judgeArr(addViewData[x].data)) {
													//固定
													dtVagueSleFn(addViewData[x].data);
												} else {
													var queryData = addViewData[x].data;
													var isJsonTF = queryData.dataType && queryData.dataType === 'json';
													var fqObj = {
														url: queryData.url,
														type: queryData.type || 'post',
													};
													queryData.data && (fqObj['data'] = queryData.data);
													var selDataObj = queryData;
													self.eAjax(
														fqObj, {
															success: function(data) {
																var selDatas = data['data'];
																selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']));
																var newWrap = [];
																//判断显示名是否是多字段
																function returnName(allData, nameArr) {
																	var str = '';
																	for(var aa = 0; aa < nameArr.length; aa++) {
																		str = str + allData[nameArr[aa]] + (aa == (nameArr.length - 1) ? '' : '_');
																	}
																	return str;
																};
																var isName = selDataObj['rely'] && selDataObj['rely']['name'];
																var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
																for(var v = 0; v < selDatas.length; v++) {
																	newWrap.push({
																		name: isName ?
																			(
																				typeof selDataObj['rely']['name'] == 'string' ?
																				selDatas[v][selDataObj['rely']['name']] :
																				returnName(selDatas[v], selDataObj['rely']['name'])
																			) : selDatas[v]['name'],
																		code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
																	});
																};
																dtVagueSleFn(newWrap);
															},
															isJson: isJsonTF
														});
												};
											});
									};
									//mulSelect类型
									if(addViewData[x].type === 'mulSelect') {
										ss.crtDom('div', '', '', dom, {
												cn: ['width', 'height', 'paddingTop'],
												cv: ['100%', 'auto', '6px'],
												an: ['name', 'code'],
												av: [x, '']
											})
											.appendDom(function(dom) {
												//select->con
												ss.crtDom('div', 'selectItems', '', dom, {
														cn: [
															'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'paddingLeft'
														],
														cv: [
															'100%', 'auto', '1px solid #ccc', '#fff', '3px', 13, '5px', '15px'
														]
													})
													.appendDom(function(dom) {
														//若存在form类型，则增加input赋值
														if(obj.searchBtn['add'].addType && obj.searchBtn['add'].addType == 'form') {
															ss.crtDom('input', 'input', '', dom, {
																an: ['type', 'name', 'id'],
																av: ['hidden', x, 'input_form']
															});
														};
														if(addViewData[x].data) {
															//[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
															var svgW = 20;
															var crtDom = function(dataArr) {
																dataArr.forEach(function(v, i) {
																	ss.crtDom('p', '', v.name, dom, {
																			cn: ['padding', 'color', 'fontSize', 'display', 'boxSizing', 'paddingLeft', 'position', 'userSelect', 'marginRight', 'cursor'],
																			cv: ['0px 5px', '#bbb', '13px', 'inline-block', 'content-box', '25px', 'relative', 'none', '10px', 'pointer'],
																			an: ['code'],
																			av: [v.code]
																		}, [
																			'click',
																			function(dom) {
																				function setId(type, str) {
																					var fscope = dom.parentNode.parentNode;
																					var fscopeWrap = fscope.getAttribute('code') ? fscope.getAttribute('code').split(',') : [];
																					if(type == 'add') {
																						fscopeWrap.push(str);
																					} else {
																						fscopeWrap.splice(fscopeWrap.indexOf(str), 1);
																					};
																					fscope.setAttribute('code', fscopeWrap.join());
																					self['scope']['addParaObj'][fscope.getAttribute('name')] = fscope.getAttribute('code'); //赋值给新增参数对象
																					//若是form类型
																					if(obj.searchBtn['add'].addType && obj.searchBtn['add'].addType == 'form') {
																						ss.getDom('#input_form') && (ss.getDom('#input_form').value = fscopeWrap.join());
																					}
																				};
																				if(dom.getAttribute('ischeck') && dom.getAttribute('ischeck') == 'true') {
																					ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#bbb');
																					ss.mdfCss(dom, ['color', '#bbb']);
																					ss.mdfAttr(dom, ['ischeck', 'false']);
																					setId('sul', dom.getAttribute('code'));
																				} else {
																					ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#3089DC');
																					ss.mdfCss(dom, ['color', '#3089DC']);
																					ss.mdfAttr(dom, ['ischeck', 'true']);
																					setId('add', dom.getAttribute('code'));
																				};
																			}
																		])
																		.appendDom(function(dom) {
																			//svg
																			ss.crtDom('div', 'svg', ss.svgRepository.checkboxIcon(svgW, '#bbb'), dom, {
																				cn: ['position', 'width', 'height', 'top', 'left'],
																				cv: ['absolute', svgW + 'px', svgW + 'px', '8px', '0px']
																			});
																		})
																})
															};

															//是否数组，对象则需要动态获取
															ss.judgeArr(addViewData[x].data) ?
																crtDom(addViewData[x].data) :
																(function() {
																	var isJsonTF = addViewData[x].data.dataType && addViewData[x].data.dataType === 'json';
																	var fqObj = {
																		url: addViewData[x].data.url,
																		type: addViewData[x].data.type || 'post'
																	};
																	//data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
																	isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
																	addViewData[x].data.data &&
																		(fqObj['data'] = isJsonTF ? JSON.stringify(addViewData[x].data.data) : addViewData[x].data.data); //json方式传输赋值

																	var selDataObj = addViewData[x].data;
																	//获得数据
																	self.ajax(
																		fqObj,
																		function(data) {
																			var selDatas = data['data'];
																			selDataObj['digitalModel'] && (selDatas = self.digitalModelFn(data, 'data', selDataObj['digitalModel']));
																			var newWrap = [];
																			var isName = selDataObj['rely'] && selDataObj['rely']['name'];
																			var isCode = selDataObj['rely'] && selDataObj['rely']['code'];
																			for(var v = 0; v < selDatas.length; v++) {
																				newWrap.push({
																					name: isName ? selDatas[v][selDataObj['rely']['name']] : selDatas[v]['name'],
																					code: isCode ? selDatas[v][selDataObj['rely']['code']] : selDatas[v]['code']
																				});
																			};
																			crtDom(newWrap);
																		},
																		//complete
																		function() {

																		},
																		//beforeSend
																		function(request) {
																			isJsonTF &&
																				request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
																		}
																	);
																}());
														} else {
															ss.error('下拉框选项数据未找到！');
															return;
														}
													})
											});
									};
									//图片类型
									if(addViewData[x].type === 'pic') {
										ss.crtDom('div', '', '', dom, {
												cn: ['width', 'height'],
												cv: ['100%', 'auto'],
											})
											.appendDom(function(dom) {
												//图片各项

												[1, 2].forEach(function(v) {
													ss.crtDom('label', '', '', dom, {
															cn: ['display', 'marginRight'],
															cv: ['inline-block', '10px'],
															an: ['for'],
															av: [x + v]
														}, [
															'click',
															function(dom) {
																var showExcelNameFn = function(inputId) {
																	document.getElementById(inputId).onchange = function() {
																		var preview = ss.getDom('.img', dom);
																		var addSvgDom = ss.getDom('.addSvg', dom);
																		var file = ss.getDom('input', dom).files[0];
																		var reader = new FileReader();
																		if(file) {
																			reader.readAsDataURL(file);
																		}
																		reader.addEventListener("load", function() {
																			preview.src = reader.result;
																			preview.style.display = 'block';
																			addSvgDom.style.display = 'none';
																		}, false);
																		return file;
																	}
																};
																showExcelNameFn(ss.getDom('input', dom).getAttribute('id'));
															}
														])
														.appendDom(function(dom) {
															ss.crtDom('div', 'selectItems', '', dom, {
																	cn: [
																		'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'cursor'
																	],
																	cv: [
																		'90px', '100px', '1px solid #ccc', '#fff', '3px', 13, '5px', 'pointer'
																	]
																})
																.appendDom(function(dom) {
																	var svgW = 40;
																	ss.crtDom('div', 'addSvg', ss.svgRepository.add(svgW, '#ccc'), dom, {
																		cn: ['width', 'height', 'margin', 'position', 'marginTop'],
																		cv: [svgW + 'px', svgW + 'px', '0 auto', 'relative', '20px']
																	});
																	ss.crtDom('img', 'img', '', dom, {
																		cn: ['display', 'height', 'width', 'margin'],
																		cv: ['none', '100%', '100%', '0 auto'],
																		an: ['type', 'id'],
																		av: ['file', x + '_img']
																	});
																});
															ss.crtDom('input', 'input', '', dom, {
																cn: ['display'],
																cv: ['none'],
																an: ['type', 'id', 'name'],
																av: ['file', x + v, x]
															});
														});
												})
											});
									};
									//视频类型
									if(addViewData[x].type === 'video') {
										ss.crtDom('div', '', '', dom, {
												cn: ['width', 'height'],
												cv: ['100%', 'auto'],
											})
											.appendDom(function(dom) {
												//图片各项
												ss.crtDom('label', '', '', dom, {
														cn: ['display', 'marginRight'],
														cv: ['inline-block', '10px'],
														an: ['for'],
														av: [x]
													}, [
														'click',
														function(dom) {
															var showExcelNameFn = function(inputId) {
																document.getElementById(inputId).onchange = function() {
																	var file = this.files[0];
																	//判断所选择文件是否为excel文件类型
																	//if(/\.xl/.test(file.name)){
																	if(true) {
																		ss.getDom('.wrap', dom).innerHTML = String(file.name);
																	} else {
																		layer.msg('非视频文件，请重新选择');
																		return;
																	}

																}
															};
															showExcelNameFn(ss.getDom('input', dom).getAttribute('id'));
														}
													])
													.appendDom(function(dom) {
														ss.crtDom('div', 'wrap', '', dom, {
																cn: [
																	'width', 'height', 'border', 'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'cursor'
																],
																cv: [
																	'90px', '100px', '1px solid #ccc', '#fff', '3px', 13, '5px', 'pointer'
																]
															})
															.appendDom(function(dom) {
																var svgW = 40;
																ss.crtDom('div', 'addSvg', ss.svgRepository.add(svgW, '#ccc'), dom, {
																	cn: ['width', 'height', 'margin', 'position', 'marginTop'],
																	cv: [svgW + 'px', svgW + 'px', '0 auto', 'relative', '20px']
																});
															});
														ss.crtDom('input', 'input', '', dom, {
															cn: ['display'],
															cv: ['none'],
															an: ['type', 'id', 'name'],
															av: ['file', x, x]
														});
													});
											});
									};
									//上传录音的特殊类型
									if(addViewData[x].type === '_upload') {
										ss.crtDom('form', '', '', dom, {
												cn: [],
												cv: [],
												an: ['id', 'enctype'],
												av: ['_uploadForm', 'multipart/form-data']
											})
											.appendDom(function(dom) {
												//录音路径+文件选择+上传 
												ss.crtDom('div', '', '**录音路径**', dom, {
													cn: [
														'width', 'height', 'lineHeight', 'borderBottom', 'fontSize', 'marginTop', 'display', 'verticalAlign', 'color',
														'textOverflow', 'overflow', 'whiteSpace'
													],
													cv: [
														'40%', '38px', '38px', '1px solid #ccc', '14px', '6px', 'inline-block', 'middle', '#333',
														'ellipsis', 'hidden', 'nowrap'
													],
													an: ['name'],
													av: [x]
												});
												//录音上传所带的参数：流程名+uuid
												ss.crtDom('input', '', '', dom, {
													cn: [],
													cv: [],
													an: ['type', 'name', 'id'],
													av: ['hidden', 'flowName', '_uploadFlowName']
												});
												ss.crtDom('input', '', '', dom, {
													cn: [],
													cv: [],
													an: ['type', 'name'],
													av: ['hidden', 'uuid']
												});
												ss.crtDom('label', '', '请选择录音文件', dom, {
													cn: [
														'height', 'display', 'lineHeight', 'textAlign', 'cursor', 'fontSize', 'width',
														'boxSizing', 'border', 'borderRadius', 'textOverflow', 'overflow', 'whiteSpace', 'verticalAlign', 'marginLeft'
													],
													cv: [
														'38px', 'inline-block', '38px', 'center', 'pointer', '14px', '33%',
														'border-box', '1px solid #ccc', '3px', 'ellipsis', 'hidden', 'nowrap', 'middle', '5%'
													],
													an: ['for', 'id'],
													av: ['file', '_uploadLabel']
												});
												ss.crtDom('input', '', '', dom, {
													cn: ['display'],
													cv: ['none'],
													an: ['id', 'type', 'name'],
													av: ['file', 'file', 'file']
												}, [
													'change',
													function(dom) {
														var file = dom.files[0];
														//判断所选择文件是否为excel文件类型
														if(/\.mp3|\.wav|\.wma|\.ogg|\.ape|\.aac/.test(file.name)) {
															dom.parentNode.querySelector('label').innerHTML = file.name;
															dom.parentNode.querySelector('label').title = file.name;
														} else {
															layer.msg('非音频文件，请重新选择');
															return;
														}
													}
												])
												ss.crtDom('div', '', '上传', dom, {
													cn: ['display', 'height', 'lineHeight', 'border', 'borderRadius', 'width', 'verticalAlign', 'fontSize', 'textAlign', 'cursor', 'marginLeft'],
													cv: ['inline-block', '38px', '38px', '1px solid #ccc', '3px', '20%', 'middle', '14px', 'center', 'pointer', '2%']
												}, [
													'click',
													function() {
														//提交前参数判断
														if(document.querySelector('#_uploadLabel').innerHTML.indexOf('请选择') != -1) {
															layer.msg('请先选择音频文件！');
															return false;
														};
														if(!self['scope']['addParaObj']['flowUuid']) {
															layer.msg('上传文件需要选择流程名称！');
															return false;
														};
														//根据id获取流程图名
														var ps = ss.getDom('[name="flowUuid"]', ss.getDom('.view_con')).querySelectorAll('p');
														var endName = '';
														for(var c = 0; c < ps.length; c++) {
															if(ps[c].getAttribute('code') == self['scope']['addParaObj'][
																	['flowUuid']
																]) {
																endName = ps[c].innerHTML;
																break;
															}
														};
														ss.getDom('#_uploadFlowName').value = endName;
														var options = {
															type: 'post',
															url: '/admin/record/uploadFile.action',
															beforeSend: function(request) {
																ss.c3Loading.show();
															},
															success: function(data) {
																if(data.result == 'success') {
																	ss.c3Loading.hidden();
																	ss.layer.msg('上传成功！请填写提问对答保存！');
																	self['scope']['addParaObj']['recordPath'] = data['data']['path'];
																	//修改路径
																	ss.getDom('#_uploadForm').querySelector('[name="recordPath"]').innerHTML = data['data']['path'];
																	//新增弹窗的额外参数集合
																	self['scope']['addParaObj_extra'] || (self['scope']['addParaObj_extra'] = {});
																	self['scope']['addParaObj']['recordUuid'] = data['data']['uuid'];
//																	self['scope']['addParaObj_extra']['recordUuid'] = data['data']['uuid'];
																	
																} else {
																	ss.layer.msg(data['data'] && data['msgError'] && '系统异常！');
																}
															}
														};
														$('#_uploadForm').ajaxSubmit(options);
													}
												])

											})
									}

								})

							//右
//							if(addViewData[x].verify) {
//								ss.crtDom('div', '', '*', dom, {
//									cn: ['textAlign', 'width', 'color', 'display', 'fontSize'],
//									cv: ['center', '3%', 'red', 'inline-block', '14px']
//								})
//							}
						}

					);
				addViewData[x].type === 'area' && (itemDom.style.height = 'auto');
			}; //for循环

			self.domWrap['viewC_con'].appendChild(nviewContainer);
		},
		//弹窗内容 -> 自定义html字符串
		htmlRender:function(htmlStr){
			var self = this;
			self.domWrap['viewC_con'].innerHTML = htmlStr;
		},
		//弹窗显示
		show:function(obj){
			var self = this;
			this.render(obj);
			obj.item && this.itemRender(obj.item,obj);
			obj.html && this.htmlRender(obj.html,obj);
			window.setTimeout(function(){
				self.domWrap.conView.style.opacity = 1; 
				self.domWrap.conView.style.transform = 'scale(1)' 
			},40)
			return this;
		},
		//弹窗隐藏
		hidden:function(){
			this.domWrap.shadeView.parentNode.removeChild(this.domWrap.shadeView);
			this.domWrap.conView.parentNode.removeChild(this.domWrap.conView);
		},
		//渲染结束
		renderOut:function(cbFn){
			cbFn && cbFn(this);
		},
		//各工具类
		ajax: function(obj, success, complete, beforeSend, type) { 
			var tempObj = obj;
			tempObj.success = function(data) {
				if((type && type=='table') || (data && data.code==0)){
					if(data.code == 0) {
						success(data);
					} else {
						data['data'] && ss.layer.msg(data['data']);
						data['errorMsg'] && ss.layer.msg(data['errorMsg']);
						!data['data'] && !data['errorMsg'] && layer.msg('接口有误！');
					}
				}
				else{
					if(data.result == 'success') {
						success(data);
					} else {
						data['data'] && ss.layer.msg(data['data']);
						data['errorMsg'] && ss.layer.msg(data['errorMsg']);
						!data['data'] && !data['errorMsg'] && layer.msg('接口有误！');
					}
				}
			};
			tempObj.beforeSend = function(request) {
				ss.c3Loading.show();
				beforeSend && beforeSend(request);
			};
			tempObj.complete = function(xhr) {
				ss.c3Loading.hidden();
				complete && complete();
				xhr.responseText || ss.error('登陆失效，接口没返回登陆页面！');
				//登陆时效性，接口约定：重定向->index.html
				xhr.responseText.indexOf('lg_login_pw_label') != -1 &&
					layer.confirm('登陆已失效，请重新登陆！', function(index) {
						location.href = 'index.html';
					});
			}
			$.ajax(tempObj);
		},
		eAjax: function(qObj, oObj) {
			var self = this,
				obj = self.sourceObj;
			oObj['isJson'] && (qObj['data'] = JSON.stringify(qObj['data'])); //json方式传输赋值
			oObj['isJson'] && (qObj['dataType'] = 'json'); //dataType值为json
			//获得数据
			self.ajax(
				qObj,
				//success
				function(data) {
					oObj['success'] && oObj['success'](data);
				},
				//complete
				function() {
					oObj['complete'] && oObj['complete']();
				},
				//beforeSend
				function(request) {
					oObj['isJson'] &&
						request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

					oObj['beforeSend'] && oObj['beforeSend'](request);
				}
			);
		},
		//数据模型转换
		digitalModelFn: function(data, name, judge) {
			var endDataArr;
			if(judge[name]) {
				var judgeData = judge[name]['location'];
				var tempWrap = data;
				for(var a = 0; a < judgeData.length; a++) {
					tempWrap = tempWrap[judgeData[a]];
				}
				endDataArr = tempWrap;
				return endDataArr;
			} else {
				ss.error('不存在该字段的数据模型！')
				return;
			}
		},
	}
		
	out('ssView',new ssView());
});