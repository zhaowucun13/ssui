ss.set(['code','api','layout'],function(out){

	ss.code({
		el:ss.getDom('#ss_layout_example'),
		id:'layout',
		title:'基本代码',
		explain:'作为项目的基本配置，务必在app.js配置',
		example:function(dom){
			dom.style.height = '300px';
			ss.layout({
				el:dom,
				platformName:'ssUi管理员',
				signOut: function(){
					window.location.href = 'http://47.107.154.57/';
				}
			})
		}
	})

	ss.api({
		el:ss.getDom('#ss_layout_api'),
		list:[
			{attr:'el',explain:'layout模块的父级dom元素',type:'dom对象',defaultVal:'body元素'},
			{attr:'platformName',explain:'配置右上角显示的名称',type:'String字符串',defaultVal:'管理员'},
			{attr:'signOut',explain:'退出的点击事件回调',type:'Function函数',defaultVal:'跳转index.html'},
		],
		title:'API',
		explain:'为了敏捷开发，摈弃了自定义的路由配置，各页固定于项目的"/assets/view/"路径下，以hash值命名，自动获取对应的.html和.js资源，(备注：不存在资源会404报错)'
	})
	
})