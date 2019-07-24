ss.set(['code','api','selTool'],function(out){

	ss.code({
		el:ss.getDom('#ss_selTool_example'),
		id:'code',
		title:'基本代码', 
		explain:'简易版的选择工具，具备自主翻页、模糊搜索、多选的功能',
		example:function(dom){
			dom.style.height = '420px';
			var testDatas = [
				{name:'混世魔王',id:'1'},{name:'牛魔王',id:'2'},{name:'蛟魔王',id:'3'},
				{name:'鹏魔王',id:'4'},{name:'猕猴王',id:'5'},{name:'禺绒王',id:'6'},
				{name:'寅将军',id:'7'},{name:'熊山君',id:'8'},{name:'特处士',id:'9'},
				{name:'黑风怪',id:'10'},{name:'白骨精',id:'11'},{name:'黄袍怪',id:'12'},
				{name:'金角大王',id:'13'},{name:'银角大王',id:'14'},{name:'精细鬼',id:'15'},
				{name:'九尾狐狸',id:'16'},{name:'狮猁怪',id:'17'},{name:'圣婴大王',id:'18'},
				{name:'鼍龙',id:'19'},{name:'虎力大仙',id:'20'},{name:'鹿力大仙',id:'21'},
				{name:'羊力大仙',id:'22'},{name:'鲤鱼怪',id:'23'},{name:'兕怪',id:'24'},
			]
			ss.selTool({
				data:testDatas,//总数据
				el:dom,//追加元素
				defaultArr:[1,2],
				pageSize:21,//每页数量
			})
		}
	})

	ss.api({
		el:ss.getDom('#ss_selTool_api'),
		list:[
			{attr:'el',explain:'code模块的父级dom元素ID',type:'dom对象',defaultVal:'无，必填'},
			{attr:'data',explain:'选择工具依赖的数据',type:'Array数组',defaultVal:'无，必填'},
			{attr:'defaultArr',explain:'默认选中的项',type:'Array数组',defaultVal:'[]'},
			{attr:'pageSize',explain:'每页加载的数量',type:'Number数字',defaultVal:'9'},
		],
		title:'API',
		explain:'SelTool为自身模块，通过简单的api配置，从而快速引入简易版的选择工具'
	})

})