ss.set(['code','api'],function(out){

	ss.code({
		el:ss.getDom('#ss_code_example'),
		id:'code',
		title:'基本代码',
		explain:'具备功能：1、案例的展示 2、简单的标题与介绍 3、对代码的简单修饰'
	})

	ss.api({
		el:ss.getDom('#ss_code_api'),
		list:[
			{attr:'el',explain:'code模块的父级dom元素ID',type:'dom对象',defaultVal:'无，必填'},
			{
				attr:'id',
				explain:'同级路径的同名txt文件，满足code开合标签的规范,提供对应的id值(备注：避免文本带有&lt;/code&gt;)',
				type:'String字符串',
				defaultVal:'无，必填'
			},
			{attr:'title',explain:'当前展示code的标题',type:'String字符串',defaultVal:'标题'},
			{attr:'explain',explain:'对当前展示code的描述',type:'String字符串',defaultVal:'描述'},
			{attr:'example',explain:'案例的追加地方，回调函数接受第一个参为dom对象',type:'Funtion函数',defaultVal:'无，必填'},
			{attr:'renderOut',explain:'渲染结束回调，第一个参数为实例对象',type:'Funtion函数',defaultVal:'-'},
		],
		title:'API',
		explain:'Code为自身模块，通过简单的api配置，从而快速修饰你的代码，有利于展示'
	})

})