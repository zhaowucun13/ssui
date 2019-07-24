ss.set(['code'],function(out){

	
	ss.code({
		el:ss.getDom('#ss_method_config'),
		id:'ss_module_set',
		title:'定义一个模块',
		explain:'下面为代码演示，通过ss.set的方法快速定义一个模块，若要依赖其它模块，则在第一个参数以数组的形式引入'
	})

	ss.code({
		el:ss.getDom('#ss_method_use'),
		id:'ss_method_use',
		title:'在项目配置模块',
		explain:'在app.js中配置路径后，便可在项目中任意引用，路径以ssui.js文件为相对路径配置'
	})

	
})