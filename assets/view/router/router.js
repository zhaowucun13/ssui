ss.set(['code','api'],function(out){

	ss.code({
		el:ss.getDom('#ss_router_example'),
		id:'router',
		title:'基本代码',
		explain:'作为项目的基本配置，务必在app.js配置'
	})

	ss.code({
		el:ss.getDom('#ss_router_example1'),
		id:'router111',
		title:'基本代码',
		explain:'作为项目的基本配置，务必在app.js配置'
	})

	ss.api({
		el:ss.getDom('#ss_router_api'),
		list:[
			{
				attr:'defaultHash',explain:'全局路由的默认值，若页面无hash值则跳转此值',type:'String字符串',defaultVal:'无，必填',
			},
			{
				attr:'viewWrap',explain:'单页面依赖的dom元素，配置获取dom的参数',type:'String字符串',defaultVal:'#ss_view',
			}
		],
		title:'API',
		explain:'为了敏捷开发，摈弃了自定义的路由配置，各页固定于项目的"/assets/view/"路径下，以hash值命名，自动获取对应的.html和.js资源，(备注：不存在资源会404报错)，渲染至指定位置'
	})
	
})