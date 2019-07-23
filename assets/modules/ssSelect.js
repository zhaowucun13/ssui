/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out) {
	
	function ssSelect(obj){
		this.scope = {};
		this.domWrap = {};
		this.sourceObj = obj;
		this.init();//初始化
	}
	ssSelect.prototype = {
		construct:ssSelect,
		init:function(){
			this.sourceObj.type=='mulSel' ? this.mulSelRender() :  this.render();//渲染
		},
		//弹窗渲染
		render:function(){
			var selObj = this.sourceObj;
			var self = this;
			ss.crtDom('div', '', selObj.name, selObj.appendTo, {
					cn: ['width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize', 'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'],
					cv: [selObj.width ? selObj.width : '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', '#757575', '13px', '3px', 'none', 'pointer', 'relative', '5px'],
					an: ['name', 'code'],
					av: [selObj.name, '']
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
						//ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
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
							//ss.mdfCss(dom.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.parentNode.getAttribute('code') ? '#000' : '#757575']); //
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
						cv: [selObj.width ? selObj.width : '100%', selObj.data.length < 5 ? 'auto' : 6 * 30 + 'px', '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13]
					})
					.appendDom(function(dom) {
						
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
										self['scope'].code = dom.getAttribute('code');
										dom.parentNode.style.display = 'none'; //下拉框隐藏
										ss.getDom('.dateSvg', dom.parentNode.parentNode).style.transform = 'rotate(0deg)'; //icon旋转
										//ss.mdfCss(dom.parentNode.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.getAttribute('code') ? '#000' : '#757575']); //
										//点击回调
										selObj.cbFn && selObj.cbFn(self)
										
										//var indexVal = dom.parentNode.parentNode.parentNode.parentNode.getAttribute('name');
										//addViewData[indexVal].cbFn && addViewData[indexVal].cbFn(dom, self);
										e.stopPropagation();
									}
								])
							})
						};

						//是否数组，对象则需要动态获取
						crtDom(
							[
								{ name: '' + selObj.name + '', code: '' }
							]
							.concat(selObj.data)
						);
						
					})
				]);
			
		},
		//多选渲染
		mulSelRender:function(){
			var selObj = this.sourceObj;
			var self = this;
			ss.crtDom('div', '', selObj.name, selObj.appendTo, {
					cn: ['width', 'height', 'lineHeight', 'padding', 'border', 'backgroundColor', 'color', 'fontSize', 'borderRadius', 'userSelect', 'cursor', 'position', 'marginTop'],
					cv: [selObj.width ? selObj.width : '80%', '30px', '30px', '0px 10px', '1px solid #dee4f1', '#f4f8fa', '#757575', '13px', '3px', 'none', 'pointer', 'relative', '5px'],
					an: ['name', 'code'],
					av: [selObj.name, '']
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
						//ss.mdfCss(dom, ['boxShadow', '0px 0px .5px .3px #1890ff', 'border', '1px solid #f4f8fa']);
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
							//ss.mdfCss(dom.parentNode, ['boxShadow', 'none', 'border', '1px solid #dee4f1', 'color', dom.parentNode.getAttribute('code') ? '#000' : '#757575']); //
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
						cv: [selObj.width ? selObj.width : '100%', selObj.data.length < 5 ? 'auto' : 6 * 30 + 'px', '1px solid #ccc', 'absolute', '32px', '-1px', '#fff', '3px', 'hidden', 'auto', 'none', 13]
					})
					.appendDom(function(dom) {
						
						
						ss.crtDom('div', '', '', dom, {
							cn: ['width', 'height', 'paddingTop'],
							cv: ['100%', 'auto', '6px'],
							an: ['name', 'code'],
							av: [selObj.name, '']
						})
						.appendDom(function(dom) {
							//select->con
							ss.crtDom('div', 'selectItems', '', dom, {
									cn: [
										'width', 'height',  'backgroundColor', 'borderRadius', 'zIndex', 'padding', 'paddingLeft'
									],
									cv: [
										'100%', 'auto', '#fff', '3px', 13, '5px', '15px'
									]
								})
								.appendDom(function(dom) {
									
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
													function(dom,e) {
														//阻止冒泡 
														e.stopPropagation();
														//存在最多控制项，则校验判断
														function setId(type, str, txt) {
															var fscope = self.scope.code;
															var fscopeWrap = fscope ? fscope.split(',') : [];
															var txtScope = self.scope.txt;
															var txtScopeWrap = txtScope ? txtScope.split(',') : [];
															
															if(type == 'add') {
																fscopeWrap.push(str);
																txtScopeWrap.push(txt);
															} else {
																fscopeWrap.splice(fscopeWrap.indexOf(str), 1);
																txtScopeWrap.splice(txtScopeWrap.indexOf(str), 1);
															};
															self['scope'].code = fscopeWrap.join(); //赋值给新增参数对象
															self['scope'].txt = txtScopeWrap.join(); //赋值给新增参数对象   
															
															var _txt = self['scope'].txt||selObj.name;
															_txt.length> 15 && (_txt = _txt.slice(0,15)+'...')
															ss.setDomTxt(dom.parentNode.parentNode.parentNode.parentNode,_txt);
															
														};
														if(dom.getAttribute('ischeck') && dom.getAttribute('ischeck') == 'true') {
															ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#bbb');
															ss.mdfCss(dom, ['color', '#bbb']);
															ss.mdfAttr(dom, ['ischeck', 'false']);
															setId('sul', dom.getAttribute('code'), ss.getDomTxt(dom));
														} else {
															if(selObj.maxNum && self.scope.code && self.scope.code.split(',').length==selObj.maxNum){
																ss.layer.msg('最多选择'+selObj.maxNum+'项');
															}
															else{ 															
																ss.getDom('.svg', dom).innerHTML = ss.svgRepository.checkboxIcon(svgW, '#3089DC');
																ss.mdfCss(dom, ['color', '#3089DC']);
																ss.mdfAttr(dom, ['ischeck', 'true']);
																setId('add', dom.getAttribute('code'), ss.getDomTxt(dom));
															}

														};
																											
														//点击回调 
														selObj.cbFn && selObj.cbFn(self)
										
													}
												])
												.appendDom(function(dom) {
													//svg
													ss.crtDom('div', 'svg', ss.svgRepository.checkboxIcon(svgW, '#bbb'), dom, {
														cn: ['position', 'width', 'height', 'top', 'left'],
														cv: ['absolute', svgW + 'px', svgW + 'px', '6px', '0px']
													});
												})
										})
									};
									//是否数组，对象则需要动态获取
									crtDom(selObj.data) 
									
								})
						});
						
						
						
					})
				]);
			
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
		 
	out('ssSelect',function(obj) {
		return new ssSelect(obj);
	});
});