/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(['dtVagueSle'], function(out) {
	var dtView = {
		//弹窗渲染 
		rd_viewFn: function(titName, typeTxt, addType, curData, dtSelf, dtObj, formType) {
			var ajaxAdd = false //用于判断是否需要在保存时发送额外的请求
			var ajaxAddUrl = '' //额外请求的接口
			dtObj.searchBtn && dtObj.searchBtn.add &&
				dtObj.searchBtn.add.ajaxAdd &&
				(ajaxAdd = dtObj.searchBtn.add.ajaxAdd.flag, ajaxAddUrl = dtObj.searchBtn.add.ajaxAdd.url)
			//var ajaxAdd = dtObj.searchBtn.add.ajaxAdd; 
			var self = dtSelf,
				obj = dtObj;
			var dtViewThis = this;
			var viewContainer = document.createDocumentFragment();
			//遮罩层
			var shadeView = ss.crtDom('div', 'view_shade', '', viewContainer, {
				cn: ['width', 'height', 'position', 'top', 'left', 'backgroundColor', 'opacity', 'zIndex', 'display'],
				cv: [ss.paraWrap.clwx, ss.paraWrap.clhx, 'fixed', '0px', '0px', '#000', .3, 1300, 'block']
			});
			//内容
			var conView = ss.crtDom('div', 'view_con', '', viewContainer, {
					cn: [
						'width', 'position', 'top', 'left',
						'backgroundColor', 'borderRadius', 'zIndex', 'display'
					],
					cv: [
						ss.paraWrap.clw * .5 + 'px', 'fixed', ss.paraWrap.clh * .15 + 'px', ss.paraWrap.clw * .25 + 'px',
						'#fff', '5px', 1301, 'block'
					]
				})
				.appendDom(function(dom) {
					//内容标题
					ss.crtDom('div', 'viewC_tit', titName, dom, {
							cn: [
								'cursor', 'widht', 'height', 'fontSize',
								'position', 'lineHeight', 'textAlign', 'color', 'backgroundColor', 'paddingLeft'
							],
							cv: [
								'move', '100%', '48px', '17px',
								'relative', '48px', 'left', '#fff', '#296799', '20px'
							],
							an: ['flag'],
							av: [addType ? (formType ? 'editform' : 'addform') : typeTxt]
						})
						.appendDom(function(dom) {
							//svg
							var widthP = 22;
							ss.crtDom('div', 'ss_dtView_titleClose', ss.svgRepository.close(widthP, '#fff'), dom, {
								cn: ['width', 'height', 'position', 'top', 'right'],
								cv: [widthP + 'px', widthP + 'px', 'absolute', '14px', '20px']
							}, [
								'click',
								function(dom) {
									dtViewThis.lg_hiddenViewFn(self, obj);
								}
							]);
						});
					//内容容器
					ss.crtDom(addType == 'form' ? 'form' : 'div', 'viewC_con', '', dom, {
						cn: ['width', 'boxSizing', 'padding', 'clear', 'transition'],
						cv: ['100%', 'border-box', '10px 0px', 'both', 'all .3s'],
						an: ['id', 'enctype'],
						av: [addType ? 'form' : '', addType ? 'multipart/form-data' : '']
					});
					//内容按钮容器
					ss.crtDom('div', 'viewC_btn', '', dom, {
							cn: ['width', 'height', 'fontSize', 'boxSizing', 'bottom', 'borderTop', 'left', 'lineHeight', 'textAlign', 'paddingTop'],
							cv: ['100%', '54px', '18px', 'border-box', '0px', '1px solid #e5e5e5', '0%', '54px', 'center', '12px'],
						})
						.appendDom(function(dom) {
							//不是查看，才渲染保存按钮
							if(typeTxt != 'dtl') {
								//保存按钮
								ss.crtDom('span', 'viewC_btnSave', '保存', dom, {
									cn: [
										'color', 'backgroundColor', 'fontSize', 'padding', 'borderRadius', 'marginRight', 'cursor',
										'display', 'height', 'lineHeight', 'verticalAlign'
									],
									cv: [
										'#fff', '#296799', '13px', '0px 30px', '5px', '15px', 'pointer',
										'inline-block', '30px', '30px', 'top'
									]
								}, [
									'click',
									function(dom) {
										var _titleDom = ss.getDom('.viewC_con', dom.parentNode.parentNode);
										var typeTxt = ss.getDom('.viewC_tit', dom.parentNode.parentNode).getAttribute('flag');

										//新增
										if(typeTxt === 'add' && _titleDom.nodeName == 'DIV') {
											var addParaObj = self['scope']['addParaObj'];
											//*号必填的校验
											var addParaVerObj = self['scope']['addParaVerObj'];
											for(var x in addParaVerObj) {
												if(!addParaObj[x] && addParaObj[x]!==0) {
													ss.layer.msg(addParaVerObj[x] + '未填写！');
													return;
												}
											};
											//针对单字段的校验 ->通过check
											var _curItems = obj.searchBtn.add.items;
											for(var k in addParaObj) {
												if(_curItems[k] && _curItems[k].check) {
													var checkObj = _curItems[k].check;
													if(checkObj && checkObj(addParaObj) && checkObj(addParaObj).result) {
														ss.layer.msg(checkObj(addParaObj).tip);
														return;
													}
												}
											};
											//存在额外固定值，则追加
											var extraPara = obj.searchBtn.add.extraPara;
											if(extraPara && ss.judgeObj(extraPara) && ss.getObjleg(extraPara) != 0) {
												for(var xx in extraPara) {
													addParaObj[xx] = extraPara[xx];
												}
											};
											//存在调整参数  新提交
											if(obj.searchBtn.add.adjust) {
												addParaObj = obj.searchBtn.add.adjust(addParaObj);
											};
											var fqObj = {
												url: obj.searchBtn.add.url,
												type: obj.searchBtn.add.type || 'post',
												data: (obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json') ? JSON.stringify(addParaObj) : addParaObj
											};
											obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json' && (fqObj['dataType'] = 'json');
											//校验通过，进行接口动作
											if(ajaxAdd) {
												self.ajax(
													fqObj,
													//success
													function(data) {
														var fqObj1 = {
															url: ajaxAddUrl,
															type: obj.searchBtn.add.type || 'post',
															data: (obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json') ?
																JSON.stringify(addParaObj) : addParaObj
														}
														self.ajax(
															fqObj1,
															//success
															function(data) {
																self.lg_reloadFn(); //表格重载
																layer.msg('新增成功！'); //提示
															},
															//complete
															function() {
																dtViewThis.lg_hiddenViewFn(self, obj); //隐藏弹窗
															},
															//beforeSend
															function(request) {
																obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json' &&
																	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
															}
														);
													},
													//complete
													//													function() {
													//														dtViewThis.lg_hiddenViewFn(self, obj); //隐藏弹窗
													//													},
													//beforeSend
													function(request) {
														obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json' &&
															request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
													}
												);
											} else {
												self.ajax(
													fqObj,
													//success
													function(data) {
														self.lg_reloadFn(); //表格重载
														layer.msg(obj.searchBtn.add.tip || '新增成功！'); //提示
														obj.searchBtn.add.saveEndFn && obj.searchBtn.add.saveEndFn(addParaObj); //保存成功后执行
													},
													//complete
													function() {
														dtViewThis.lg_hiddenViewFn(self, obj); //隐藏弹窗
													},
													//beforeSend
													function(request) {
														obj.searchBtn.add.dataType && obj.searchBtn.add.dataType === 'json' &&
															request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
													}
												);
											}
										};
										//编辑
										if(typeTxt === 'editform' && _titleDom.nodeName == 'DIV') {
											var editParaObj = self['scope']['editParaObj'];
											var editParaVerObj = self['scope']['editParaVerObj'];
											var otherEditObj = self['scope']['otherEditObj'];
											var editItem = self['scope']['editItem'];
											//debugger;
											//校验参数
											
											for(var x in editParaVerObj) {
												if(!editParaObj[x] && editParaObj[x]!==0) {
													ss.layer.msg(editParaVerObj[x] + '未填写！');
													return;
												}
											};
											//针对单字段的校验 ->通过check
											var _curItems = editItem.items;
											for(var k in editParaObj) {
												if(_curItems[k] && _curItems[k].check) {
													var checkObj = _curItems[k].check;
													if(checkObj && checkObj(editParaObj) && checkObj(editParaObj).result) {
														ss.layer.msg(checkObj(editParaObj).tip);
														return;
													}
												}
											};
											//校验通过，进行接口动作
											for(var w in otherEditObj) {
												editParaObj[w] = otherEditObj[w];
											};
											var queryObj = editParaObj;
											//根据操作项数组，获取对应的{}数据
											var editBtnObj;

											function getEditBtnObj(str) {
												for(var a = 0; a < obj.table.operation.length; a++) {
													if(obj.table.operation[a].flag == str || obj.table.operation[a].name == '编辑') {
														return obj.table.operation[a];
													};
												};
											};
											obj.table.operation && obj.table.operation.length !== 0 &&
												(editBtnObj = getEditBtnObj('edit'));

											//若存在别名，进行替换
											if(editItem['txtShimName']) {
												var newObj = {};
												for(var e in queryObj) {
													newObj[
														(editItem['txtShimName'] && editItem['txtShimName'][e]) ? editItem['txtShimName'][e] : e
													] = queryObj[e];
												};
												queryObj = newObj;
											};

											//是否json类型提交
											var isJsonTF = editBtnObj.dataType && editBtnObj.dataType === 'json';
											//是否全量传值
											if(editBtnObj.updateType && editBtnObj.updateType == 'all') {
												var tempObj = curData;
												for(var d in queryObj) {
													tempObj[d] = queryObj[d];
												}
												queryObj = tempObj;
											};
											//是否保存前->强制梳理传参
											editBtnObj.forceDp && (queryObj = editBtnObj.forceDp(queryObj));

											var fqObj = {
												url: editItem.url,
												type: editBtnObj.type || 'post',
												data: isJsonTF ? JSON.stringify(queryObj) : queryObj
											};
											isJsonTF && (fqObj['dataType'] = 'json');
											self.ajax(
												fqObj,
												//success
												function(data) {
													self.lg_reloadFn(); //表格重载
													layer.msg('编辑成功！'); //提示
													editItem.saveEndFn && editItem.saveEndFn(editParaObj); //保存成功后执行
												},
												//complete
												function() {
													dtViewThis.lg_hiddenViewFn(self, obj); //隐藏弹窗
												},
												//beforeSend
												function(request) {
													isJsonTF &&
														request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
												}
											);
										};
										//from表单
										if(typeTxt === 'addform' && _titleDom.nodeName == 'FORM') {
											var addParaObj = self['scope']['addParaObj'];
											//*号必填的校验
											var addParaVerObj = self['scope']['addParaVerObj'];
											for(var x in addParaVerObj) {
												if(x == 'attachment') {
													if(addParaObj.pic) {
														continue;
													}
												}
												if(!addParaObj[x]) {
													ss.layer.msg(addParaVerObj[x] + '未填写！');
													return;
												}
											};
											var formData = obj.searchBtn.add;
											var options = {
												type: 'post',
												url: formData.url,
												success: function(d) {
													if(d.result == 'success') {
														self.lg_reloadFn(); //表格重载
														layer.msg('新增成功！'); //提示
													} else {
														layer.msg(d.errorMsg || '新增失败！');
													}
												},
												complete: function() {
													dtViewThis.lg_hiddenViewFn(self, obj); //隐藏弹窗
												}
											};
											$('#form').ajaxSubmit(options);
										};
										//编辑的from表单
										if(typeTxt === 'editform' && _titleDom.nodeName == 'FORM') {

											function getEditUrl() {
												var operation = obj.table.operation;
												for(var a = 0; a < operation.length; a++) {
													if(operation[a].flag == 'edit' || operation[a].name == '编辑') {
														return operation[a];
													}
												}
											}

											var editParaObj = self['scope']['editParaObj'];
											var editParaVerObj = self['scope']['editParaVerObj'];
											var otherEditObj = self['scope']['otherEditObj'];
											var editItem = self['scope']['editItem'];
											//debugger;
											//校验参数
											for(var x in editParaVerObj) {
												if(!(editParaObj[x] == '0' ? true : editParaObj[x])) {
													ss.layer.msg(editParaVerObj[x] + '未填写！');
													return;
												}
											};
											//针对单字段的校验 ->通过check
											var _curItems = editItem.items;
											for(var k in editParaObj) {
												var checkObj = _curItems[k].check;
												if(checkObj && checkObj(editParaObj) && checkObj(editParaObj).result) {
													ss.layer.msg(checkObj(editParaObj).tip);
													return;
												}
											};

											var formData = obj.searchBtn.add;
											var options = {
												type: 'post',
												url: getEditUrl().url,
												beforeSend: function() {
													ss.c3Loading.show();
												},
												success: function(d) {
													if(d.result == 'success') {
														self.lg_reloadFn(); //表格重载
														layer.msg(getEditUrl().name + '成功！'); //提示
													} else {
														layer.msg(d.errorMsg || getEditUrl().name + '失败！');
													}
												},
												complete: function() {
													ss.c3Loading.hidden();
													dtViewThis.lg_hiddenViewFn(self, obj); //隐藏弹窗
												}
											};
											$('#form').ajaxSubmit(options);
										};
									}
								]);
							};
							//取消按钮
							ss.crtDom('span', 'viewC_btnCan', '取消', dom, {
								cn: [
									'color', 'backgroundColor', 'fontSize', 'padding', 'borderRadius', 'marginLeft', 'cursor', 'display',
									'height', 'lineHeight', 'verticalAlign'
								],
								cv: [
									'#fff', '#296799', '13px', '0px 30px', '5px', '15px', 'pointer', 'inline-block',
									'30px', '30px', 'top'
								]
							}, [
								'click',
								function(dom) {
									dtViewThis.lg_hiddenViewFn(self, obj);
								}
							])
						})

				});
			self.domWrap['shadeView'] = shadeView;
			self.domWrap['conView'] = conView;
			self.domWrap['viewC_tit'] = ss.getDom('.viewC_tit', conView);
			self.domWrap['viewC_con'] = ss.getDom('.viewC_con', conView);
			self.domWrap['viewC_btnSave'] = ss.getDom('.viewC_btnSave', conView);
			ss.drag(self.domWrap['viewC_tit'], self.domWrap['conView']); //拖拽
			ss.getDom('body').appendChild(viewContainer);
		},
		//弹窗新增
		lg_addViewFn: function(titleName, type, addType, dtSelf, dtObj) {
			var self = dtSelf,
				obj = dtObj;
			//self.rd_viewFn(titleName,type,addType);//渲染弹窗容器
			this.rd_viewFn(titleName, type, addType, '', self, obj); //渲染弹窗容器
			//新增数据
			var addViewData = (obj.searchBtn && obj.searchBtn.add && obj.searchBtn.add.items) ? obj.searchBtn.add.items : ss.error('缺少新增参数！');
			//虚拟dom
			var nviewContainer = document.createDocumentFragment();
			//新增参数存储
			self['scope']['addParaObj'] = {};
			
			//存在默认值：用于操作 
			var _addObj = obj.searchBtn.add;
			_addObj.dfOperateObj && (function(){
				for(var d in _addObj.dfOperateObj){
					self['scope']['addParaObj'][d] = _addObj.dfOperateObj[d]
				}
			}())
			
			//需要校验的参数存储
			self['scope']['addParaVerObj'] = {};
			//渲染
			for(var x in addViewData) {
				self['scope']['addParaObj'][x] = ''; //各个字段为空
				addViewData[x].verify && (self['scope']['addParaVerObj'][x] = addViewData[x].name);
				var itemH = '40px'; //每项高度
				//由js样式控制
				var styleCn = []
				var styleCv = []
				addViewData[x].styles && (styleCn = addViewData[x].styles.styleCn, styleCv = addViewData[x].styles.styleCv)
				//空dom类型
				if(addViewData[x].type === '_dom') {
					var _dom = ss.crtDom('div', 'items', '', nviewContainer, {
						cn: ['display'],
						cv: [addViewData[x].isShow && addViewData[x].isShow == 'false' ? 'none' : 'block'],
						an: ['name'],
						av: [x]
					});
					addViewData[x].renderFn && addViewData[x].renderFn(_dom);
					continue;
				};
				//选项容器
				var itemDom = ss.crtDom('div', 'items', '', nviewContainer, {
						cn: [
							'width', 'height', 'lineHeight', addViewData[x].type === 'pic' && 'marginTop',
							'display'
						].concat(styleCn),
						cv: [
							'100%',
							(addViewData[x].type === 'mulSelect' || addViewData[x].type === 'pic' || addViewData[x].type === 'video') ?
							'auto' :
							itemH, itemH, '10px',
							addViewData[x].isShow && addViewData[x].isShow == 'false' ? 'none' : 'block'
						].concat(styleCv),
						an: ['name'],
						av: [x]
					})
					.appendDom(
						function(dom) {
							//左---
							var leftVal = addViewData[x].isPer ?
								addViewData[x].name + '(%)' + '：' :
								(addViewData[x].verify ? ('* ' + addViewData[x].name + '：') : (addViewData[x].name + '：'));
							//左---
							//剔除_dom类型的创建
							addViewData[x].type === '_dom' || ss.crtDom('div', '', addViewData[x].verify ? '* ' + addViewData[x].name + '：' : addViewData[x].name + '：', dom, {
								cn: ['display', 'verticalAlign', 'width', 'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize'],
								cv: ['inline-block', 'top', '40%', 'auto', 'right', '20px', '10px', '14px']
							});
							//右---
							ss.crtDom('div', '', '', dom, {
									cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
									cv: ['inline-block', 'top', '60%', '100%', addViewData[x].type === 'mulSelect' ? '50px' : '50px']
								})
								.appendDom(function(dom) {
									var domD = dom
									//txt类型
									if(addViewData[x].type === 'txt') {
										addViewData[x].value && (self['scope']['addParaObj'][x] = addViewData[x].value);
										var _curInputDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
											an: ['placeholder', 'type', 'name', 'value'],
											av: [
												addViewData[x].readonly ? (addViewData[x].placeholder || addViewData[x].name) : '请输入' + (addViewData[x].placeholder || addViewData[x].name), 'text', x, addViewData[x].value || ''
											]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
											}
										]);
										//存在只读状态->则设置
										addViewData[x].readonly && (
											_curInputDom.setAttribute('readonly', 'readonly'),
											ss.mdfCss(_curInputDom, ['backgroundColor', '#efefef'])
										);
									};
									if(addViewData[x].type === 'txtShow') { 
										var _curInputDom = ss.crtDom('span', '',addViewData[x].defaultTxt||'' , dom, {
											cn: ['width', 'height', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '14px', '6px'],
										});
									};
									//创建dom容器
									if(addViewData[x].type === 'crtDom') {  
										addViewData[x].hidden && (dom.parentNode.style.display = 'none');
										var _curInputDom = ss.crtDom('div', '','' , dom,{
											cn:['height'],cv:['100%']
										});
										addViewData[x].renderFn && addViewData[x].renderFn(_curInputDom,self)
									};
									//txt类型
									if(addViewData[x].type === 'txtAndB') {
										var imeiList = []
										var txtAndBDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['80%', '30px', '1px solid #ccc', '14px', '6px'],
											an: ['placeholder', 'type', 'name'],
											av: [
												'请输入' + (addViewData[x].placeholder || addViewData[x].name), 'text', x
											]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = []
												self['scope']['addParaObj'][dom.getAttribute('name')].push(dom.value);
												imeiList.push(dom.value);
											}
										]);
										ss.crtDom('span', '', '添加', dom, {
											cn: ['lineHeight', 'marginLeft', 'display', 'padding', 'border', 'backgroundColor', 'color', 'fontSize',
												'marginRight', ' borderRadius', 'verticalAlign', 'cursor', 'userSelect', 'marginTop'
											],
											cv: ['19px', '5px', 'inline-block', '3px 9px', '1px solid rgb(41, 103, 153)', ' rgb(41, 103, 153)', 'rgb(255, 255, 255)', '13px',
												'8px', '2px', 'top', 'pointer', 'none', '7px'
											],
										}, [
											'click',
											function(dom) {
												var itemDom = dom.parentNode.parentNode
												var topCss = itemDom.nextSibling.style.marginTop
												if(topCss) {
													itemDom.nextSibling.style.marginTop = Number(topCss.split('p')[0]) + 47 + 'px'
												} else {
													itemDom.nextSibling.style.marginTop = '47px'
												}
												var name1 = txtAndBDom.getAttribute('name')
												ss.crtDom('input', '', '', domD, {
													cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
													cv: ['80%', '30px', '1px solid #ccc', '14px', '6px'],
													an: ['placeholder', 'type', 'name'],
													av: [
														'请输入' + (addViewData[name1].placeholder || addViewData[name1].name), 'text', name1
													]
												}, [
													'change',
													function(dom) {
														imeiList.push(dom.value)
														self['scope']['addParaObj'][dom.getAttribute('name')] = imeiList;
													}
												]);
											}
										])
									};
									//area类型
									if(addViewData[x].type === 'area') {
										dom.parentNode.style.height = '70px'
										ss.crtDom('textarea', 'add', '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding'],
											cv: ['80%', '60px', '1px solid #ccc', '14px', '6px', '10px'],
											an: ['placeholder', 'name'], 
											av: [addViewData[x].placeholder || ('请输入' + addViewData[x].name), x]
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
												//改变回调
												var _txt = dom.getAttribute('name'); 
												addViewData[_txt].changeFn && addViewData[_txt].changeFn(dom,self);
											}
										])
									};
									//num类型
									if(addViewData[x].type === 'num') {
										var dot = addViewData[x].dot
										var indexX = x;
										ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
											an: ['pattern', 'placeholder', 'type', 'name'],
											av: ['\d*\.\d{2}', '请输入' + (addViewData[x].placeholder || addViewData[x].name), 'number', x]
										}, [
											'change',
											function(dom) {
												self['scope']['addParaObj'][dom.getAttribute('name')] = dom.value;
												addViewData[indexX].cbFn && addViewData[indexX].cbFn(dom.value, self);
											},
											'input',
											function(dom) {
												if(dot) {
													if(dom.value.split('.')[1] && dom.value.split('.')[1].toString().length > 2) {
														layer.msg('只能输入带' + dot + '位小数点的数字');
														dom.value = ''
													}
												}
											}
										]);
									};
									//time类型
									if(addViewData[x].type === 'time') {
										var timeDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
											an: ['placeholder', 'name'],
											av: ['请选择' + addViewData[x].name, x]
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
										ss.crtDom('div', '', addViewData[x].name, dom, {
												cn: ['width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize', 'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'],
												cv: [addViewData[x].width ? addViewData[x].width : '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', '#757575', '13px', '3px', 'none', 'pointer', 'relative', '5px'],
												an: ['name', 'code'],
												av: [x, '']
											}, [
												'click',
												function(dom, e) {
													//下拉框展开
													var curDomCss = window.getComputedStyle(ss.getDom('.dateSvg', dom)).getPropertyValue('transform')
													if(curDomCss == 'matrix(1, 0, 0, 1, 0, 0)' || curDomCss == 'none') {
														ss.getDom('.selectItems', dom).style.display = 'block';
														ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
													} else {
														ss.getDom('.selectItems', dom).style.display = 'none';
														ss.getDom('.dateSvg', dom).style.transform = 'rotate(0deg)';
													}
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
													}
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
											.appendDom([
												//select->icon
												ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), '', {
													cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
													cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
												}),
												//select->con
												ss.crtDom('div', 'selectItems', '', '', {
													cn: ['width', 'height', 'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'],
													cv: [addViewData[x].width ? addViewData[x].width : '100%', addViewData[x].data.length < 5 ? 'auto' : 6 * 30 + 'px', '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13]
												})
												.appendDom(function(dom) {
													if(addViewData[x].data) {
														//[{name:''+addViewData[x].name+'',code:''}].concat(addViewData[x].data).forEach(function(v,i){
														var crtDom = function(dataArr, sData) {
															ss.mdfCss(dom, ['height', dataArr.length < 5 ? 'auto' : 6 * 30 + 'px']);
															dataArr.forEach(function(v, i) {
																ss.crtDom('p', '', v.name, dom, {
																	cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
																	cv: ['0px 10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
																	an: ['code', '_index'],
																	av: [v.code, i]
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
																		self['scope']['addParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
																		dom.parentNode.style.display = 'none'; //下拉框隐藏
																		ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
																		ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //
																		//点击回调
																		var indexVal = dom.parentNode.parentNode.parentNode.parentNode.getAttribute('name');
																		addViewData[indexVal].cbFn && addViewData[indexVal].cbFn(dom, self);
																		e.stopPropagation();
																	}
																])
															})
														};

														//是否数组，对象则需要动态获取
														ss.judgeArr(addViewData[x].data) ?
															crtDom([{
																name: '' + addViewData[x].name + '',
																code: ''
															}].concat(addViewData[x].data)) :
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
																		crtDom([{
																			name: '' + addViewData[x].name + '',
																			code: ''
																		}].concat(newWrap), selDatas);
																		//对下拉框数据存储
																		self.scope['selDatas'] || (self.scope['selDatas'] = {});
																		self.scope['selDatas'][x] = selDatas;
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
											]);
									};
									//blurrySel类型 -> 带模糊搜索的下拉框
									if(addViewData[x].type === 'blurrySel') {
										ss.crtDom('div', x + 'Wrap', '', dom, {
												cn: ['width', 'paddingTop', 'display', 'height', 'verticalAlign', 'position', 'marginRight'],
												cv: ['100%', '7px', 'inline-block', '40px', 'top', 'relative', addViewData[x].isLine ? '3px' : (x === obj.searchOption.length - 1 ? '40px' : '8px')],
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
													var dtVagueSleSelf = new ss.dtVagueSle({
														name: dom.getAttribute('showName'), //选项名
														appendTo: blurrySelDom, //追加元素
														data: renderData, //依赖数据
														hv: 30,
														cbFn: function(self) {
															dtSelf['scope']['addParaObj'][dom.getAttribute('name')] = self['scope']['code'];
															var indexVal = dom.parentNode.parentNode.getAttribute('name');
															addViewData[indexVal].cbFn && addViewData[indexVal].cbFn(dom, self, self['scope']['code'], dtSelf, self['scope']['curdata']);
														}, //点击回调
														clearFn: function(self) {
															//document.querySelector('#userId').setAttribute('value','');
														}, //清空回调
													});
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
													var curAttr = dom.getAttribute('name');
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
																		curdata: selDatas[v],
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
																//对下拉框数据存储
																self.scope['selDatas'] || (self.scope['selDatas'] = {});
																self.scope['selDatas'][curAttr] = selDatas;
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
										self['scope']['addParaObj']['pic'] = false;
										ss.crtDom('div', '', '', dom, {
												cn: ['width', 'height'],
												cv: ['100%', 'auto'],
											})
											.appendDom(function(dom) {
												//图片各项
												var _sourceArr = [1, 2];
												addViewData[x].isOneData && (_sourceArr = [1])
												_sourceArr.forEach(function(v) {
													ss.crtDom('label', '', '', dom, {
															cn: ['display', 'marginRight'],
															cv: ['inline-block', '10px'],
															an: ['for', 'name'],
															av: [x + v, x]
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
																			self['scope']['addParaObj']['pic'] = true;
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
									
									//上传Excel的特殊类型
									if(addViewData[x].type === 'excel') {
										ss.crtDom('form', '', '', dom, {
												cn: [],
												cv: [],
												an: ['id', 'enctype'],
												av: ['_uploadForm', 'multipart/form-data']
											})
											.appendDom(function(dom) {
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
												ss.crtDom('label', '', '请选择Excel文件', dom, {
													cn: [
														'height', 'display', 'lineHeight', 'textAlign', 'cursor', 'fontSize', 'width',
														'boxSizing', 'border', 'borderRadius', 'textOverflow', 'overflow', 'whiteSpace', 'verticalAlign'
													],
													cv: [
														'38px', 'inline-block', '38px', 'center', 'pointer', '14px', '35%',
														'border-box', '1px solid #ccc', '3px', 'ellipsis', 'hidden', 'nowrap', 'middle'
													],
													an: ['for', 'id'],
													av: ['file', '_uploadLabel']
												});
												ss.crtDom('input', '', '', dom, {
													cn: ['display'],
													cv: ['none'],
													an: ['id', 'type', 'name','txt'],
													av: ['file', 'file', 'uploadExcelFile',x]
												}, [
													'change',
													function(dom) {
														var file = dom.files[0];
														//判断所选择文件是否为excel文件类型
														if(/\.xlsx|\.xlsm|\.xls|\.csv/.test(file.name)) {
															dom.parentNode.querySelector('label').innerHTML = file.name;
															dom.parentNode.querySelector('label').title = file.name;
														} else {
															layer.msg('非Excel文件，请重新选择');
															return;
														}
														var _txt = dom.getAttribute('txt') 
														addViewData[_txt].upload && addViewData[_txt].upload(dom,self);
													}
												])
												ss.crtDom('div', '', '下载模板', dom, {
													cn: ['display', 'height', 'lineHeight', 'border', 'borderRadius', 'width', 'verticalAlign', 'fontSize', 'textAlign', 'cursor', 'marginLeft'],
													cv: ['inline-block', '38px', '38px', '1px solid #ccc', '3px', '20%', 'middle', '14px', 'center', 'pointer', '2%'],
													an: ['txt'],
													av: [x]
												}, [
													'click',
													function(dom) {
														addViewData[dom.getAttribute('txt')].dlTemplate && addViewData[dom.getAttribute('txt')].dlTemplate()
													}
												])

											})
									}
									
								})
						}

					);
				addViewData[x].type === 'area' && (itemDom.style.height = 'auto');
			}; //for循环
			self.domWrap['viewC_con'].appendChild(nviewContainer);
			//完成渲染->进行高度判断
			this.lg_contrlViewHFn(self);
		},
		//弹窗编辑
		lg_editViewFn: function(curData, type, dtSelf, dtObj, editType) {
			var self = dtSelf,
				obj = dtObj;
			//编辑数据
			var operationArr = obj.table.operation;
			//editItem：整个编辑配置项
			//editObj：主键的值
			var editObj, editItem;
			for(var a = 0; a < operationArr.length; a++) {
				(operationArr[a].name === '编辑' || operationArr[a].flag === 'edit') &&
				(editItem = operationArr[a], editObj = (typeof operationArr[a].data == 'string' ? JSON.parse(operationArr[a].data) : operationArr[a].data));
			};
			this.rd_viewFn(editItem['name'], type, editType, curData, self, obj, 'edit'); //渲染弹窗
			for(var s in editObj) {
				editObj[s] = curData[s];
			}
			//点击编辑回调
			editItem.cbFn && editItem.cbFn(curData, editItem);

			var editViewData = editItem.items ? editItem.items : ss.error('缺少编辑参数！');

			//虚拟dom
			var eviewContainer = document.createDocumentFragment();
			//编辑参数存储
			self['scope']['editParaObj'] = {};
			//需要校验的参数存储
			self['scope']['editParaVerObj'] = {};
			//额外的编辑字段
			self['scope']['otherEditObj'] = editObj;
			self['scope']['editItem'] = editItem;
			var clearVsEvents = [];

			//判断有没有自定义高度，有则赋值
			if(editItem.height) {
				ss.mdfCss(self.domWrap.viewC_con, ['height', editItem.height, 'overflowY', 'auto']);
			}

			//渲染
			for(var x in editViewData) {
				self['scope']['editParaObj'][x] = curData[x]; //各个字段赋值
				editViewData[x].verify && (self['scope']['editParaVerObj'][x] = editViewData[x].name);
				var itemH = '40px'; //每项高度
				//空dom类型
				if(editViewData[x].type === '_dom') {
					var _dom = ss.crtDom('div', 'items', '', eviewContainer, {
						cn: ['display'],
						cv: [editViewData[x].isShow && editViewData[x].isShow == 'false' ? 'none' : 'block'],
						an: ['name'],
						av: [x]
					});
					editViewData[x].renderFn && editViewData[x].renderFn(_dom);
					continue;
				};
				//选项容器
				ss.crtDom('div', 'items', '', eviewContainer, {
						cn: [
							'width', 'height', 'lineHeight',
							'display'
						],
						cv: [
							editItem.layout && editItem.layout == 'lr' ? '50%' : '100%',
							(editViewData[x].type === 'mulSelect' || editViewData[x].type === 'area' || editViewData[x].type === 'pic' || editViewData[x].type === 'photo' || editViewData[x].type === 'video') ?
							'auto' :
							itemH, itemH,
							editViewData[x].isShow && editViewData[x].isShow == 'false' ?
							'none' :
							(editItem.layout && editItem.layout == 'lr' ? 'inline-block' : 'block')
						],
						an: ['name'],
						av: [x]
					})
					.appendDom(
						function(dom) {
							//左---
							var leftVal = editViewData[x].isPer ?
								editViewData[x].name + '(%)' + '：' :
								(editViewData[x].verify ? ('* ' + editViewData[x].name + '：') : (editViewData[x].name + '：'));
							ss.crtDom('div', '', leftVal, dom, {
									cn: ['display', 'verticalAlign', 'width', 'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize'],
									cv: ['inline-block', 'top', '40%', 'auto', 'right', '20px', '10px', '14px']
								}),
								//右---
								ss.crtDom('div', '', '', dom, {
									cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
									cv: ['inline-block', 'top', '60%', '100%', '50px']
								})
								.appendDom(function(dom) {
									//图片类型
									if(editViewData[x].type === 'pic') {
										ss.crtDom('div', '', '', dom, {
												cn: ['width', 'height'],
												cv: ['100%', 'auto'],
											})
											.appendDom(function(dom) {
												//图片各项
												var _sourceArr = [1, 2];
												editViewData[x].isOneData && (_sourceArr = [1])
												_sourceArr.forEach(function(v) {
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
																		var _selfDom = this;
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

																			self['scope']['editParaObj'][_selfDom.getAttribute('name')] = reader.result;
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
									//txt类型--------------------
									if(editViewData[x].type === 'txt') {
										var _curInputDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
											an: [
												'placeholder', 'type', 'name', 'value'
											],
											av: [
												'请输入' + (editViewData[x].placeholder || editViewData[x].name),
												'text',
												x, curData[x] ? curData[x] : ''
											]
										}, [
											'change',
											function(dom) {
												self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
											}
										]);
										//存在只读状态->则设置
										editViewData[x].readonly && (
											_curInputDom.setAttribute('readonly', 'readonly'),
											ss.mdfCss(_curInputDom, ['backgroundColor', '#efefef'])
										);
										//渲染完成->触发
										editViewData[x].rendEnd && editViewData[x].rendEnd(_curInputDom, curData, dom, self);
									};
									//photo类型--------------------
									if(editViewData[x].type === 'photo') {
										ss.crtDom('div', '', '', dom, {
												cn: [],
												cv: []
											})
											.appendDom(function(dom) {
												ss.crtDom('img', '', '', dom, {
													cn: ['width'],
													cv: ['100%'],
													an: ['src'],
													av: [editViewData[x].prefix ? editViewData[x].prefix + curData[x] : curData[x]]
												})
											});
									};

									//area类型
									if(editViewData[x].type === 'area') {
										ss.crtDom('textarea', 'edit', curData[x] || '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'marginTop', 'padding'],
											cv: ['100%', '60px', '1px solid #ccc', '14px', '6px', '10px'],
											an: ['placeholder', 'name'],
											av: ['请输入' + editViewData[x].name, x]
										}, [
											'change',
											function(dom) {
												var curVal = dom.value;
												if(/([^\u4e00-\u9fa5|\w])/.test(curVal) && editViewData[x].wrap) {
													var nCode = /([^\u4e00-\u9fa5|\w])/g.exec(curVal)[0];
													var tempArr = curVal.split(nCode);
													var endStr = '';
													for(var b = 0; b < tempArr.length; b++) {
														endStr = endStr + '<p>' + tempArr[b] + '</p>'
													}
													self['scope']['editParaObj'][dom.getAttribute('name')] = endStr;
												} else {
													self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
												};
											}
										])
									};
									//num类型-------------------
									if(editViewData[x].type === 'num') {
										var indexX = x;
										var _curTxtInputDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
											an: ['placeholder', 'type', 'name', 'value'],
											av: ['请输入' + (editViewData[x].placeholder || editViewData[x].name), 'number', x, curData[x] ? curData[x] : '']
										}, [
											'change',
											function(dom) {
												self['scope']['editParaObj'][dom.getAttribute('name')] = dom.value;
												editViewData[indexX].cbFn && editViewData[indexX].cbFn(dom.value, self, curData[indexX]);
											}
										]);
										//存在只读状态->则设置
										editViewData[x].readonly && (
											_curTxtInputDom.setAttribute('readonly', 'readonly'),
											ss.mdfCss(_curTxtInputDom, ['backgroundColor', '#efefef'])
										);
									};
									//time类型------------------
									if(editViewData[x].type === 'time') {
										var timeDom = ss.crtDom('input', '', '', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'marginTop'],
											cv: ['100%', '30px', '1px solid #ccc', '14px', '6px'],
											an: ['placeholder', 'name'],
											av: ['请选择' + editViewData[x].name, x]
										});
										!ss.laydate && ss.error('未引入时间控件！')
										ss.laydate.render({
											elem: timeDom,
											type: editViewData[x].timeType || 'date',
											value: curData[x] ?
												(
													curData[x].length >= 13 ?
													ss.dpDate.normal(curData[x]) :
													curData[x]
												) : '',
											done: function(val) {
												self['scope']['editParaObj'][timeDom.getAttribute('name')] = val;
											}
										});
										//存在只读状态->则设置
										editViewData[x].readonly && (
											timeDom.setAttribute('readonly', 'readonly'),
											ss.mdfCss(timeDom, ['backgroundColor', '#efefef'])
										);
									};
									//select类型----------------
									if(editViewData[x].type === 'select') {
										editViewData[x].data || ss.error('select类型缺少data数据！');
										var curEditVal = '-';
										var _curSelDom = ss.crtDom('div', '', curEditVal, dom, {
												cn: [
													'width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize',
													'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'
												],
												cv: [
													editViewData[x].width ? editViewData[x].width : '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', '#757575', '13px',
													'3px', 'none', 'pointer', 'relative', '5px'
												],
												an: ['name', 'code'],
												av: [x, '']
											}, [
												'click',
												function(dom, e) {
													//下拉框展开
													var curDomCss = window.getComputedStyle(ss.getDom('.dateSvg', dom)).getPropertyValue('transform')
													if(curDomCss == 'matrix(1, 0, 0, 1, 0, 0)' || curDomCss == 'none') {
														ss.getDom('.selectItems', dom).style.display = 'block';
														ss.getDom('.dateSvg', dom).style.transform = 'rotate(180deg)';
													} else {
														ss.getDom('.selectItems', dom).style.display = 'none';
														ss.getDom('.dateSvg', dom).style.transform = 'rotate(0deg)';
													}
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
													}
													var curDom = dom;
													//下拉框隐藏
													var clearStatuFn = function() {
														var dom = ss.getDom('.selectItems', curDom);
														ss.getDom('.selectItems', curDom) && (ss.getDom('.selectItems', curDom).style.display = 'none');
														ss.getDom('.dateSvg', dom.parentNode) && (ss.getDom('.dateSvg', dom.parentNode).style.transform = 'rotate(0deg)'); //icon旋转
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
											.appendDom(function(dom) {
												function endNameCodeFn(dataArr, curVal) {
													var tempObj = {};
													for(var e = 0; e < dataArr.length; e++) {
														(dataArr[e].code == curVal || dataArr[e].name == curVal) &&
														(tempObj['eName'] = dataArr[e].name, tempObj['eCode'] = dataArr[e].code);
													}
													return tempObj;
												};
												//若存在form类型，则增加input赋值
												if(editType == 'form') {
													ss.crtDom('input', 'input_edit_form', '', dom, {
														an: ['type', 'name', 'id', 'value'],
														av: ['hidden', x, 'input_edit_form', endNameCodeFn(editViewData[x].data, curData[x]).eCode || '']
													});
												};

												var fDom = dom;
												//select->icon
												ss.crtDom('span', 'dateSvg', ss.svgRepository.sl_ad(14, '#555'), dom, {
														cn: ['display', 'top', 'right', 'width', 'height', 'position', 'lineHeight'],
														cv: ['block', '8px', '5px', '14px', '14px', 'absolute', '14px']
													}),
													//select->con
													ss.crtDom('div', 'selectItems', '', dom, {
														cn: [
															'width', 'height',
															'border', 'position', 'top', 'left', 'backgroundColor', 'borderRadius', 'overflowX', 'overflowY', 'display', 'zIndex'
														],
														cv: [
															editViewData[x].width ? editViewData[x].width : '100%', editViewData[x].data.length < 5 ? 'auto' : 6 * 30 + 'px',
															'1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13
														],
														an: ['txt'],
														av: [x]
													})
													.appendDom(function(dom) {
														if(editViewData[x].data) {
															//[{name:''+editViewData[x].name+'',code:''}].concat(editViewData[x].data).forEach(function(v,i){
															var crtDom = function(dataArr, type) {
																ss.mdfCss(dom, ['height', dataArr.length < 5 ? 'auto' : 6 * 30 + 'px']);

																var xx = dom.getAttribute('txt'); //当前修改的字段
																//追加编辑的默认值
																if(type == 'fixed') {
																	var endD = endNameCodeFn(editViewData[xx].data, curData[xx]);
																	ss.setDomTxt(fDom, endD.eName || dataArr[0].name);
																	ss.mdfAttr(fDom, ['code', endD.eCode || dataArr[0].code]);
																} else {
																	var endD = endNameCodeFn(dataArr, curData[xx]);
																	ss.setDomTxt(fDom, endD.eName);
																	ss.mdfAttr(fDom, ['code', endD.eCode]);
																};
																//遍历渲染fn
																dataArr.forEach(function(v, i) {
																	ss.crtDom('p', '', v.name, dom, {
																		cn: ['padding', 'color', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace'],
																		cv: ['0px 10px', i === 0 ? '#ccc' : '#333', '13px', 'hidden', 'ellipsis', 'nowrap'],
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
																			self['scope']['editParaObj'][dom.parentNode.parentNode.getAttribute('name')] = dom.getAttribute('code');
																			dom.parentNode.style.display = 'none'; //下拉框隐藏
																			ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
																			ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //

																			//存在input值，则添加
																			var _inputPDom = dom.parentNode.parentNode;
																			_inputPDom.querySelector('.input_edit_form') && (
																				_inputPDom.querySelector('.input_edit_form').value = dom.getAttribute('code')
																			)

																			//点击回调
																			var indexVal = dom.parentNode.parentNode.parentNode.parentNode.getAttribute('name');
																			editViewData[indexVal].cbFn && editViewData[indexVal].cbFn(dom, self);
																			e.stopPropagation();
																		}
																	])
																});
															};

															//是否数组，对象则需要动态获取
															ss.judgeArr(editViewData[x].data) ?
																crtDom([{
																	name: '' + editViewData[x].name + '',
																	code: ''
																}].concat(editViewData[x].data), 'fixed') :
																(function(x) {
																	var isJsonTF = editViewData[x].data.dataType && editViewData[x].data.dataType === 'json';
																	var fqObj = {
																		url: editViewData[x].data.url,
																		type: editViewData[x].data.type || 'post',
																	};
																	isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
																	editViewData[x].data.data &&
																		(fqObj['data'] = isJsonTF ? JSON.stringify(editViewData[x].data.data) : editViewData[x].data.data); //json方式传输赋值
																	var selDataObj = editViewData[x].data;
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
																			crtDom([{
																				name: '' + editViewData[x].name + '',
																				code: ''
																			}].concat(newWrap));
																			//对下拉框的数据进行存储																//对下拉框数据存储
																			self.scope['selDatas'] || (self.scope['selDatas'] = {});
																			self.scope['selDatas'][x] = selDatas;
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
																}(x))
														} else {
															ss.error('下拉框选项数据data未配置！');
														}
													})
											});

										//渲染完成->触发
										editViewData[x].rendEnd && editViewData[x].rendEnd(_curSelDom, curData ,self);
									};
									//blurrySel类型 -> 带模糊搜索的下拉框
									if(editViewData[x].type === 'blurrySel') {
										ss.crtDom('div', x + 'Wrap', '', dom, {
												cn: ['width', 'paddingTop', 'display', 'height', 'verticalAlign', 'position', 'marginRight'],
												cv: ['100%', '7px', 'inline-block', '40px', 'top', 'relative', editViewData[x].isLine ? '3px' : (a === obj.searchOption.length - 1 ? '40px' : '8px')],
												an: ['name', 'showName'],
												av: [x || '', editViewData[x].name || '']
											})
											.appendDom(function(dom) {
												var blurrySelDom = ss.crtDom('div', editViewData[x].txt, '', dom, {
													cn: ['height', 'lineHeight', 'border', 'backgroundColor', 'color',
														'width',
														'fontSize', 'borderRadius', 'verticalAlign', 'marginTop'
													],
													cv: ['30px', '30px', '1px solid #dee4f1', '#f4f8fa', '#757575',
														editViewData[x].width ? editViewData[x].width : editViewData[x].name.length * (editViewData[x].type === 'date' ? 32 : 28) + 'px',
														'13px', '2px', 'top', '0px'
													],
													an: ['txt'],
													av: [x]
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
													var dtVagueSleSelf = new ss.dtVagueSle({
														name: dom.getAttribute('showName'), //选项名
														appendTo: blurrySelDom, //追加元素
														data: renderData, //依赖数据
														hv: 30,
														//默认值
														defaultVal: curData[dom.getAttribute('name')],
														defaultName: getName2(curData[dom.getAttribute('name')]),
														cbFn: function(self) {
															dtSelf['scope']['editParaObj'][dom.getAttribute('name')] = self['scope']['code'];
															var indexVal = dom.parentNode.parentNode.getAttribute('name');
															editViewData[indexVal].cbFn && editViewData[indexVal].cbFn(dom, self, self['scope']['code'], dtSelf);
														}, //点击回调
														clearFn: function(self) {
															//document.querySelector('#userId').setAttribute('value','');
														}, //清空回调
													});
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
												if(editViewData[x].data && ss.judgeArr(editViewData[x].data)) {
													//固定
													dtVagueSleFn(editViewData[x].data);
												} else {
													var queryData = editViewData[x].data;
													var isJsonTF = queryData.dataType && queryData.dataType === 'json';
													var fqObj = {
														url: queryData.url,
														type: queryData.type || 'post',
													};
													queryData.data && (fqObj['data'] = queryData.data);
													var selDataObj = queryData;
													var curAttr = dom.getAttribute('name');
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
																//对下拉框数据存储
																self.scope['selDatas'] || (self.scope['selDatas'] = {});
																self.scope['selDatas'][x] = selDatas;
																//对下拉框数据存储
																self.scope['selDatas'] || (self.scope['selDatas'] = {});
																self.scope['selDatas'][curAttr] = selDatas;
															},
															isJson: isJsonTF
														});
												};
											});
									};
									//mulSelect类型
									if(editViewData[x].type === 'mulSelect') {
										var _curSelDom = ss.crtDom('div', '', '', dom, {
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
														if(editViewData[x].data) {
															var svgW = 20;
															var crtDom = function(dataArr, type) {
																//追加默认值
																var xx = dom.parentNode.getAttribute('name'); //当前修改的字段
																var defaultVal = curData[xx]; //当前编辑的字段
																dom.parentNode.setAttribute('code', defaultVal); //存储
																var judgeArr = defaultVal ? defaultVal.split(',') : [];
																dataArr.forEach(function(v, i) {
																	ss.crtDom('p', '', v.name, dom, {
																			cn: [
																				'padding', 'color',
																				'fontSize', 'display', 'boxSizing', 'paddingLeft', 'position', 'userSelect', 'marginRight', 'cursor'
																			],
																			cv: [
																				'0px 5px', judgeArr.length != 0 ? (judgeArr.indexOf(String(v.code)) != -1 ? '#3089DC' : '#bbb') : '#bbb',
																				'13px', 'inline-block', 'content-box', '25px', 'relative', 'none', '10px', 'pointer'
																			],
																			an: ['code', 'ischeck'],
																			av: [v.code, judgeArr.indexOf(String(v.code)) != -1 ? 'true' : 'false']
																		}, [
																			'click',
																			function(dom) {
																				var fscope = dom.parentNode.parentNode;

																				function setId(type, str) {
																					var fscope = dom.parentNode.parentNode;
																					var fscopeWrap = fscope.getAttribute('code') ? fscope.getAttribute('code').split(',') : [];
																					if(type == 'add') {
																						fscopeWrap.push(str);
																					} else {
																						fscopeWrap.splice(fscopeWrap.indexOf(str), 1);
																					};
																					fscope.setAttribute('code', fscopeWrap.join());
																					self['scope']['editParaObj'][fscope.getAttribute('name')] = fscope.getAttribute('code'); //赋值给新增参数对象
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
																				editViewData[fscope.getAttribute('name')].cbFn && editViewData[fscope.getAttribute('name')].cbFn(dom, self);
																			}
																		])
																		.appendDom(function(dom) {
																			//svg
																			ss.crtDom('div', 'svg', ss.svgRepository.checkboxIcon(svgW, judgeArr.length != 0 ? (judgeArr.indexOf(String(v.code)) != -1 ? '#3089DC' : '#bbb') : '#bbb'), dom, {
																				cn: ['position', 'width', 'height', 'top', 'left'],
																				cv: ['absolute', svgW + 'px', svgW + 'px', '8px', '0px']
																			});
																		})
																})
															};

															//是否数组，对象则需要动态获取
															ss.judgeArr(editViewData[x].data) ?
																crtDom(editViewData[x].data, 'fixed') :
																(function() {
																	var isJsonTF = editViewData[x].data.dataType && editViewData[x].data.dataType === 'json';
																	var fqObj = {
																		url: editViewData[x].data.url,
																		type: editViewData[x].data.type || 'post'
																	};
																	//data:isJsonTF ? JSON.stringify(tempObj) : tempObj,
																	isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
																	editViewData[x].data.data &&
																		(fqObj['data'] = isJsonTF ? JSON.stringify(editViewData[x].data.data) : editViewData[x].data.data); //json方式传输赋值

																	var selDataObj = editViewData[x].data;
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
										//渲染完成->触发
										editViewData[x].rendEnd && editViewData[x].rendEnd(_curSelDom, curData);

									};
								})
						}
					);
			}; //for循环
			self.domWrap['viewC_con'].appendChild(eviewContainer);
			//完成渲染->存在回调则执行 
			editItem.mountFn && editItem.mountFn(self, curData);
			//完成渲染->进行高度判断
			this.lg_contrlViewHFn(self);
		},
		//弹窗查看
		lg_seaViewFn: function(curData, flag, dtSelf, dtObj, dom) {
			var self = dtSelf,
				obj = dtObj;
			var curObj = this.lg_operationDataFn(dtSelf, flag, '查看'); //当前配置参数对象
			var curUlDom = dom.parentNode.parentNode; //当前ulDom
			//编辑数据
			var operationArr = obj.table.operation;
			var editObj, editItem;
			for(var a = 0; a < operationArr.length; a++) {
				(operationArr[a].name === '查看' || operationArr[a].flag === 'dtl') &&
				(editItem = operationArr[a], editObj = (typeof operationArr[a].data == 'string' ? JSON.parse(operationArr[a].data) : operationArr[a].data));
			};
			for(var r in editObj) {
				editObj[r] = (editItem['shim'] && editItem['shim'][r]) ? curData[editItem['shim'][r]] : curData[r];
			};
			this.rd_viewFn(editItem['name'], flag, '', '', self, obj); //渲染弹窗
			//根据操作项数组，获取对应的{}数据
			var editBtnObj;

			function getEditBtnObj(str) {
				for(var a = 0; a < obj.table.operation.length; a++) {
					if(obj.table.operation[a].flag == str || obj.table.operation[a].name == '查看') {
						return obj.table.operation[a];
					};
				};
			};
			obj.table.operation && obj.table.operation.length !== 0 &&
				(editBtnObj = getEditBtnObj('dtl'));

			//是否动态获取，否则->当前编辑数据
			if(editItem.url) {
				var isJsonTF = editBtnObj.dataType && editBtnObj.dataType === 'json';
				var fqObj = {
					url: editItem.url,
					type: editBtnObj.type || 'post',
					data: isJsonTF ? JSON.stringify(editObj) : editObj
				};
				isJsonTF && (fqObj['dataType'] = 'json');
				self.ajax(
					fqObj,
					//success
					function(data) {
						seaRenderFn(data.data);
					},
					//complete
					function() {
						// self.lg_hiddenViewFn();//隐藏弹窗
					},
					//beforeSend
					function(request) {
						isJsonTF &&
							request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
					}
				);
			} else {
				seaRenderFn(curData);
			}
			//渲染数据
			function seaRenderFn(seaData) {
				var eviewContainer = document.createDocumentFragment();
				var endSeaData = {};
				for(var s in editBtnObj.items) {
					endSeaData[s] = seaData[s];
					if(curObj['pageShowTxts'] && curObj['pageShowTxts'].indexOf(s) != -1) {
						endSeaData[s] = curUlDom.querySelector('li[name="' + s + '"]').innerHTML;
					};
				};
				//渲染 
				for(var x in endSeaData) {

					var itemH = '40px'; //每项高度
					//选项容器
					ss.crtDom('div', 'items', '', eviewContainer, {
							cn: ['width', 'height', 'padding-top'],
							cv: ['100%', 'auto', '8px'],
							an: ['name'],
							av: [x]
						})
						.appendDom([
							//左---
							ss.crtDom('div', '', editBtnObj.items[x] + '：', '', {
								cn: ['display', 'verticalAlign', 'width', 'height', 'textAlign', 'paddingRight', 'paddingLeft', 'fontSize'],
								cv: ['inline-block', 'top', '40%', '100%', 'right', '20px', '10px', '14px']
							}),
							//右---
							ss.crtDom('div', '', '', '', {
								cn: ['display', 'verticalAlign', 'width', 'height', 'paddingRight'],
								cv: ['inline-block', 'top', '60%', '100%', '50px']
							})
							.appendDom(function(dom) {
								var crtFn = function() {
									//时间转换
									if(editBtnObj.isChangeTime) {
										var timeData = editBtnObj.isChangeTime || []
										for(var i = 0; i < timeData.length; i++) {
											if(x == timeData[i]) {
												endSeaData[x] = ss.dpDate.normal(endSeaData[x])
												break
											}
										}
									}
									if(endSeaData[x] == 0) {
										endSeaData[x] = endSeaData[x].toString()
									}
									//别名转换
									//									editBtnObj.shim && editBtnObj.shim[x] && (endSeaData[x] = editBtnObj.shim[x][ endSeaData[x] ]);

									//图片显示
									var isPic = false
									if(editBtnObj.isPic) {
										var picData = editBtnObj.isPic || []
										for(var i = 0; i < picData.length; i++) {
											if(x == picData[i]) {
												isPic = true
												break
											}
										}

									}
									if(isPic) {
										ss.crtDom('img', '', '', dom, {
											cn: ['width', 'height', 'border', 'fontSize', 'padding', endSeaData[x] || 'color'],
											cv: ['30%', 'auto', '1px solid #ccc', '14px', '8px', endSeaData[x] || '#fff'],
											an: ['src'],
											av: [location.origin + endSeaData[x]]
										});
									} else {
										ss.crtDom('div', '', endSeaData[x] ? endSeaData[x] : '-', dom, {
											cn: ['width', 'height', 'borderBottom', 'fontSize', 'padding-bottom', endSeaData[x] || 'color'],
											cv: ['100%', 'auto', '1px solid #ccc', '14px', '8px', endSeaData[x] || '#fff'],
										});
									}
								};
								//								crtFn();
								//枚举转换
								if(editBtnObj.shim) {
									var shimObj, shimData;
									var isShim = false;
									//shim数据容器
									self.scope['shimScope'] = {};
									shimObj = editBtnObj.shim
									for(var y in shimObj) {
										if(y == x) {
											shimData = shimObj[y]
											isShim = true
											break
										}
									}
									if(isShim) {
										if(shimData.url) {
											var isJsonTF = shimData.dataType && shimData.dataType === 'json';
											var fqObj = {
												url: shimData.url,
												type: shimData.type || 'post',
												data: shimData.data
											};
											self.eAjax(
												fqObj, {
													success: function(data) {
														if(data.result == 'success') {
															var data = data.data || []
															var rely = shimData.rely
															var attr = dom.parentNode.getAttribute("name")
															for(var i = 0; i < data.length; i++) {
																var obj = data[i]
																if(obj[rely.code] == endSeaData[attr]) {
																	endSeaData[x] = obj[rely.name]
																	crtFn()
																	break
																}
															}
														} else {
															layer.msg(data.errorMsg)
														}
													},
													isJson: isJsonTF
												}
											);

										} else {
											editBtnObj.shim && editBtnObj.shim[x] && (endSeaData[x] = editBtnObj.shim[x][endSeaData[x]]);
											crtFn();
										}
									} else {
										crtFn()
									}
								} else {
									crtFn()
								}
							})
						]);
				}; //for循环
				self.domWrap['viewC_con'].appendChild(eviewContainer);
			};
		},
		//弹窗隐藏
		lg_hiddenViewFn: function(self, obj) {
			var self = self,
				obj = obj;
			self.domWrap['shadeView'].parentNode.removeChild(self.domWrap['shadeView']);
			self.domWrap['conView'].parentNode.removeChild(self.domWrap['conView']);
		},
		//弹窗整体高度控制
		lg_contrlViewHFn: function(self) {
			var curViewDom = self.domWrap['viewC_con'];
			if(curViewDom.offsetHeight / ss.paraWrap.clh > 0.55) {
				ss.mdfCss(curViewDom, [
					'height', ss.paraWrap.clh * 0.5 + 'px', 'overflow', 'auto'
				])
			}
		},
		//获取操作项原数据
		lg_operationDataFn: function(dtSelf, flag, btnName) {
			var operationData = dtSelf['sourceObj']['table']['operation'];
			if(operationData) {
				for(var xx = 0; xx < operationData.length; xx++) {
					if(operationData[xx]['flag'] == flag || operationData[xx]['name'] == btnName) {
						return operationData[xx];
					};
				};
			};
		}
	};
	out('dtView', dtView);
});