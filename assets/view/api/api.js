ss.set(['code','api'],function(out){

	ss.code({
		el:ss.getDom('#ss_api_example'),
		id:'api',
		title:'基本代码',
		explain:'可以对你的模块属性进行简单的展示与说明'
	})

	ss.api({
		el:ss.getDom('#ss_api_api'),
		list:[
			{attr:'el',explain:'api模块的父级dom元素ID',type:'dom对象',defaultVal:'无，必填'},
			{
				attr:'list',
				explain:'列表的数据依赖，四个属性：包括attr属性、explanin描述、type类型和defaultVal默认值',
				type:'Array数组对象',
				defaultVal:'无，必填'
			},
			{attr:'title',explain:'当前展示api的标题',type:'String字符串',defaultVal:'标题'},
			{attr:'explain',explain:'对当前展示api的描述',type:'String字符串',defaultVal:'描述'}
		],
		title:'API',
		explain:'Api为自身模块，一般配合Code模块一起使用，对模块的各项api进行解释'
	})

})