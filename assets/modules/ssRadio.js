/*!
 @Title: ss_ui
 @Author: 赵观喜
 @License：MIT
 */
ss.set(function(out) {
	
	function ssRadio(){
		this.scope = {};
		this.domWrap = {};
		this.init();//初始化
	}
	ssRadio.prototype = {
		construct:ssRadio,
		init:function(){

		},
		//弹窗内容 -> 选项渲染
		itemRender:function(item,obj){
			var self = this;
			//校验数组/对象，数组则每项创建，对象则动态创建
			var crtDom = function(dataArr) {
				//虚拟dom
				var ssRadioContainer = document.createDocumentFragment();
				var commonH = 20;
				//存在默认值->则率先保存
				self.scope.curCode = obj.defaultCode;
				dataArr.forEach(function(v, i) { 
					ss.crtDom('p', '', '', ssRadioContainer, {
						cn: [
							'padding', 'fontSize', 'overflow', 'textOverflow', 'whiteSpace',
							'height','lineHeight'
						],
						cv: [ 
							'0px 10px', '13px', 'hidden', 'ellipsis', 'nowrap',
							'35px','35px'
						],
						an: ['code', '_index'],
						av: [v.code, i]
					}, [
						'click',
						function(dom, e) {
							var pDoms = self.domWrap.ssRadioWrap.children;
							for(var i=0,iLen=pDoms.length; i<iLen; i++){
								pDoms[i].querySelector('.ss_radio_svg').innerHTML = ss.svgRepository.circleUnSel(commonH,'#cfcfcf');				
								pDoms[i].querySelector('.ss_radio_span').style.color = '#000';
							};
							dom.querySelector('.ss_radio_svg').innerHTML = ss.svgRepository.circleSel(commonH,'#409eff');				
							dom.querySelector('.ss_radio_span').style.color = '#409eff';
							//将当前选择的radio值进行保存
							self.scope.curCode = dom.getAttribute('code');
						}
					]) 
					.appendDom(function(dom){ 
						//svg
						ss.crtDom(
							'span','ss_radio_svg',
							//存在默认值
							obj.defaultCode == v.code ?
							ss.svgRepository.circleSel(commonH,'#409eff')
								:
							ss.svgRepository.circleUnSel(commonH,'#cfcfcf')
							,
							dom,
							{
								cn:['position','dispaly','width','height'],
								cv:['relative','middle',commonH+'px',commonH+'px']
						});
						//文字描述
						ss.crtDom('span','ss_radio_span',v.name,dom,{
							cn:[
								'marginLeft','cursor','color'
							],
							cv:[
								'30px','pointer',obj.defaultCode == v.code ? '#409eff' : '#000'
							]
						});
					})
				});
				var ssRadioWrap = ss.crtDom('div','ss_radio_wrap','',obj.appendTo);
				self.domWrap['ssRadioWrap'] = ssRadioWrap; 
				ssRadioWrap.appendChild(ssRadioContainer);
			};

			//是否数组，对象则需要动态获取
			ss.judgeArr(item) ?
			crtDom(item) 
				:
			(function(x) {
				
				function digitalModelFn(data, name, judge) {
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
				};
				
				var selDataObj = x;
				var isJsonTF = x.dataType && x.dataType === 'json';
				var fqObj = {
					url: x.url,
					type: x.type || 'post'
				};
				isJsonTF && (fqObj['dataType'] = 'json'); //json方式传输赋值
				x.data &&
				(fqObj['data'] = isJsonTF ? JSON.stringify(x.data) : x.data); //json方式传输赋值
				fqObj.success = function(data){
					var selDatas = data['data']; 
					selDataObj['digitalModel'] && (selDatas = digitalModelFn(data, 'data', selDataObj['digitalModel']));
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
				}
				fqObj.beforeSend = function(request){
					request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				}
				$.ajax(fqObj);

			}(item));

		},
		//弹窗显示
		show:function(obj){
			obj.item && this.itemRender(obj.item,obj);
		},
		//弹窗隐藏
		hidden:function(){
			this.domWrap.shadeView.parentNode.removeChild(this.domWrap.shadeView);
			this.domWrap.conView.parentNode.removeChild(this.domWrap.conView);
		}
	}
		
	out('ssRadio',new ssRadio());
});