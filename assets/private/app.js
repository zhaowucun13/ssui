ss.config({
	//私有模块(定义的模块)
	private: {
		'menuData': '../private/menuData.js',
		'ssuiLayout': '../private/ssuiLayout.js',
	},
	//引入模块
	incoming: {
		jquery: '../incoming/jquery-3.3.1.min.js',
	}
});

ss.use(
	//依赖的js模块
	[
		'menuData','docNavMenu',"jquery",'router', 'ssuiLayout'
	],
	function() {
		//布局
		ss.ssuiLayout.render();
		//路由
		ss.router({
			defaultHash: 'loading'
		});
		//菜单
		ss.docNavMenu({
			data: ss.menuData,
			el: ss.getDom('#ly_aside')
		}); 
})
//提前加载
.load([])
