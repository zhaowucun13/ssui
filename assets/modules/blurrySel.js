/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out) {
	function blurrySel(obj) {
		this.version = '1.0.0'; //版本号
		this.sourceObj = obj.selectObj;
		this.scope = {}; //存储数据的容器
		this.init(); //初始化
	};
	blurrySel.prototype = {
		init: function() {
			var self = this,
				obj = self.sourceObj;
			self.renderSelect(); //渲染下拉
		},
		renderSelect: function() {
			var self = this,
				obj = self.sourceObj; 
			var	clearVsEvents = []; 
			var wrapDom = obj.parentDom.querySelector('.'+obj.txt+'Wrap');
			if(wrapDom){
				wrapDom.parentNode.removeChild(wrapDom)
			}
			ss.crtDom('div', obj.txt + 'Wrap', '', obj.appendTo, {
					cn: ['width','display', 'height', 'verticalAlign', 'position', 'marginRight'],
					cv: ['100%','inline-block', '40px', 'top', 'relative', '8px'],
					an: ['name', 'showName'],
					av: [obj.txt || '', obj.name || '']
				})
				.appendDom(function(dom) {  
					var blurrySelDom = ss.crtDom('div', obj.txt, '', dom, {
						cn: ['height', 'lineHeight', 'border', 'backgroundColor', 'color',
						'width', 'fontSize', 'borderRadius', 'verticalAlign', 'marginTop'],
						cv: ['30px', '30px', '1px solid #dee4f1', '#f4f8fa', '#757575', 
						'100%', '13px', '2px', 'top', '0px'],
					});
					//实例带首字母模糊搜索的下拉框
					function dtVagueSleFn(renderData) {
						var dtSelf = self;
						var dtVagueSleSelf = new ss.dtVagueSle({
							name: dom.getAttribute('showName'), //选项名
							appendTo: blurrySelDom, //追加元素
							data: renderData, //依赖数据
							defaultVal: obj.defaultVal || '',
							defaultName: obj.defaultName || '',
							hv: 30,
							cbFn: function(self) { 
								obj.cbFn && obj.cbFn(self);//回调
							}, //点击回调
							clearFn: function(self) {
							}, //清空回调
						});
						clearVsEvents.push(dtVagueSleSelf);
					};
					dtVagueSleFn(obj.data);
				});
				//blurrySel类型 -> 下拉框隐藏事件
				var clearBlurrySelFn = function() {
					var wrapDom = ss.getDomAll('.vg_wrap', obj.parentDom);
					var svgDom = ss.getDomAll('.vg_svg', obj.parentDom);
					if(wrapDom) {
						for(var d = 0; d < wrapDom.length; d++) {
							wrapDom[d].style.display = 'none';
							svgDom[d].children[0].style.transform = 'rotate(0deg)';
						}
					};
					//清空所有的输入框内容
					var writes = ss.getDomAll('._vs_write');
					if(writes) {
						for(var b = 0; b < writes.length; b++) {
							writes[b].value = '';
						};
						clearVsEvents.forEach(function(v, i) {
							v.lg_inputFn('', v);
						})
					};
				};
				//body点击事件集合添加
				if(ss.bodyClickObj.listeners[location.hash.slice(1)]) {
					var tempArr = ss.bodyClickObj.listeners[location.hash.slice(1)];
					tempArr.push(function() {
						clearBlurrySelFn();
					});
					ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
				} else {
					var tempArr = [];
					tempArr.push(function() {
						clearBlurrySelFn();
					});
					ss.bodyClickObj.listeners[location.hash.slice(1)] = tempArr;
				};
		}
	}
	out('blurrySel', function(obj) {
		return new blurrySel(obj);
	});
})